import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_PATHS, AUTH_REQUIRED_PATHS, CONSTANTS } from './constants';
import { updateSession } from './lib/supabase/middleware';
import { getUserRoleFromSession } from './utils/auth';

export async function middleware(request: NextRequest) {
  let { response, supabase } = await updateSession(request);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  //								!!!IMPORTANT!!!
  // Make sure the path is included in the matcher below
  function checkPathStartsWith(path: string) {
    return request.nextUrl.pathname.startsWith(path);
  }

  if (authUser && checkPathStartsWith('/welcome')) {
    const redirectUrl = new URL('/', request.url);
    response = NextResponse.redirect(redirectUrl);
  }

  const isAdminPath = ADMIN_PATHS.some((path) => checkPathStartsWith(path));

  const authRequired = AUTH_REQUIRED_PATHS.some((path) => checkPathStartsWith(path));

  const userRole = await getUserRoleFromSession(supabase);
  const hasAdminPanelAccess = userRole && CONSTANTS.HAS_ADMIN_PANEL_ACCESS.includes(userRole);

  if (isAdminPath && (!authUser || !hasAdminPanelAccess)) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json({ success: false, message: 'Not Authorized.' }, { status: 401 });
    } else {
      const redirectUrl = new URL('/welcome/sign-in', request.url);
      response = NextResponse.redirect(redirectUrl);
    }
  }

  if (authRequired && !authUser) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json(
        { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED },
        { status: 401 }
      );
    } else {
      const redirectUrl = new URL('/welcome/sign-in', request.url);
      response = NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/api/secure/:path*',
    '/admin/:path*',
    '/account',
    '/orders',
    '/wishlist',
    '/checkout/:path*',
    '/cart/:path*',
    '/welcome/:path*',
  ],
};
