import { NextResponse, type NextRequest } from 'next/server';
import { ERROR_MESSAGES, HAS_ADMIN_PANEL_ACCESS } from './data';
import { updateSession } from './lib/supabase/middleware';
import getUserRoleFromSession from './utils/getUserRoleFromSession';

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

  const isAdminPath = checkPathStartsWith('/api/secure/admin') || checkPathStartsWith('/admin');

  const authRequiredPath =
    checkPathStartsWith('/api/secure') ||
    checkPathStartsWith('/account') ||
    checkPathStartsWith('/orders') ||
    checkPathStartsWith('/wishlist') ||
    checkPathStartsWith('/cart') ||
    checkPathStartsWith('/checkout');

  const userRole = await getUserRoleFromSession(supabase);
  const hasAdminPanelAccess = HAS_ADMIN_PANEL_ACCESS.includes(userRole ?? '');

  if (isAdminPath && (!authUser || !hasAdminPanelAccess)) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json({ success: false, message: 'Not Authorized.' });
    } else {
      const redirectUrl = new URL('/welcome/sign-in', request.url);
      response = NextResponse.redirect(redirectUrl);
    }
  }

  if (authRequiredPath && !authUser) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json({ success: false, message: ERROR_MESSAGES.NOT_AUTHENTICATED });
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
  ],
};
