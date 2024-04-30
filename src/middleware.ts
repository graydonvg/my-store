import { NextResponse, type NextRequest } from 'next/server';
import { ERROR_MESSAGES } from './config';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  let { response, supabase } = await updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userRole } = await supabase.from('users').select('admins(userId), managers(userId)');

  function checkPathStartsWith(path: string) {
    return request.nextUrl.pathname.startsWith(path);
  }

  //								!!!IMPORTANT!!!
  // Make sure the path is included in the matcher below

  const isAdminPath = checkPathStartsWith('/api/secure/admin') || checkPathStartsWith('/admin');

  const authRequiredPath =
    checkPathStartsWith('/api/secure') ||
    checkPathStartsWith('/account') ||
    checkPathStartsWith('/orders') ||
    checkPathStartsWith('/wishlist') ||
    checkPathStartsWith('/cart') ||
    checkPathStartsWith('/checkout');

  const isAdmin = userRole && userRole[0]?.admins[0]?.userId === user?.id ? true : false;
  const isManager = userRole && userRole[0]?.managers[0]?.userId === user?.id ? true : false;

  let authLevel = 0;

  if (isAdmin) {
    authLevel = 1;
  } else if (isManager) {
    authLevel = 2;
  }

  if (isAdminPath && (!user || authLevel === 0)) {
    if (checkPathStartsWith('/api')) {
      response = NextResponse.json({ success: false, message: 'Not Authorized.' });
    } else {
      response = NextResponse.redirect(new URL('/welcome/sign-in', request.url));
    }
  }

  if (authRequiredPath && !user) {
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
