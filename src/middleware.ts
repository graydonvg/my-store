import { NextResponse, type NextRequest } from 'next/server';
import { ERROR_MESSAGES } from './config';
import { updateSession } from './lib/supabase/middleware';
import getUserRoleFromSession from './utils/getUserRoleFromSession';
import getUserRoleBoolean from './utils/getUserRoleBoolean';

export async function middleware(request: NextRequest) {
  let { response, supabase } = await updateSession(request);

  const {
    data: { user: userAuth },
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

  const userRole = userAuth ? await getUserRoleFromSession(supabase) : null;
  const { isAdmin, isManager, isOwner } = getUserRoleBoolean(userRole);

  if (isAdminPath && (!userAuth || (!isAdmin && !isManager && !isOwner))) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json({ success: false, message: 'Not Authorized.' });
    } else {
      const redirectUrl = new URL('/welcome/sign-in', request.url);
      response = NextResponse.redirect(redirectUrl);
    }
  }

  if (authRequiredPath && !userAuth) {
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
