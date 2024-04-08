import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from './lib/supabase/database.types';
import { ERROR_MESSAGES } from './config';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('userId', user?.id ?? '');

  const isAdmin = data && data[0].isAdmin ? data[0].isAdmin : false;

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
