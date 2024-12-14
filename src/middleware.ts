import { NextResponse, type NextRequest } from 'next/server';
import {
  AUTHENTICATION_REQUIRED_PATHS,
  AUTHORIZATION_REQUIRED_PATHS,
  HAS_ADMIN_PANEL_ACCESS,
  USER_ERROR_MESSAGES,
} from './constants';
import { updateSession } from './lib/supabase/middleware';
import { getUserRoleFromSession } from './utils/auth';

export async function middleware(request: NextRequest) {
  let { supabaseResponse, supabase } = await updateSession(request);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  //								!!!IMPORTANT!!!
  // Make sure the path is included in the matcher below
  function checkPathStartsWith(path: string) {
    return request.nextUrl.pathname.startsWith(path);
  }

  if (authUser && checkPathStartsWith('/welcome')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const authorizationRequired = AUTHORIZATION_REQUIRED_PATHS.some((path) => checkPathStartsWith(path));

  const authenticationRequired = AUTHENTICATION_REQUIRED_PATHS.some((path) => checkPathStartsWith(path));

  const userRole = await getUserRoleFromSession(supabase);
  const hasAdminPanelAccess = userRole && HAS_ADMIN_PANEL_ACCESS.includes(userRole);

  if (authorizationRequired && (!authUser || !hasAdminPanelAccess)) {
    if (checkPathStartsWith('/api')) {
      return NextResponse.json({ success: false, message: 'Not Authorized.' }, { status: 401 });
    } else {
      const url = request.nextUrl.clone();
      url.pathname = '/welcome/sign-in';
      return NextResponse.redirect(url);
    }
  }

  if (authenticationRequired && !authUser) {
    if (checkPathStartsWith('/api')) {
      return NextResponse.json({ success: false, message: USER_ERROR_MESSAGES.notAuthenticated }, { status: 401 });
    } else {
      const url = request.nextUrl.clone();
      url.pathname = '/welcome/sign-in';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
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
