import { NextResponse, type NextRequest } from 'next/server';
import { ERROR_MESSAGES } from './config';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  let { response, supabase } = await updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminData } = await supabase
    .from('admins')
    .select('userId')
    .eq('userId', user?.id ?? '');

  const isAdmin = adminData && adminData[0] && adminData[0].userId ? true : false;

  function checkPathStartsWith(path: string) {
    return request.nextUrl.pathname.startsWith(path);
  }

  //								!!!IMPORTANT!!!
  // Make sure the path is included in the matcher below

  const adminOnlyPath = checkPathStartsWith('/api/secure/admin') || checkPathStartsWith('/admin');

  const authRequiredPath =
    checkPathStartsWith('/api/secure') ||
    checkPathStartsWith('/account') ||
    checkPathStartsWith('/orders') ||
    checkPathStartsWith('/wishlist') ||
    checkPathStartsWith('/cart') ||
    checkPathStartsWith('/checkout');

  if (adminOnlyPath && (!user || isAdmin === false)) {
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
