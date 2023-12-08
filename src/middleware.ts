import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from './lib/supabase/database.types';

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
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('user_id', session?.user.id ?? '');

  const isAdmin = data ? data[0].is_admin : false;

  function checkPathStartsWith(path: string) {
    return request.nextUrl.pathname.startsWith(path);
  }

  const adminOnlyPath = checkPathStartsWith('/api/admin') || checkPathStartsWith('/admin-view');

  const authorizedPath =
    checkPathStartsWith('/account') ||
    checkPathStartsWith('/orders') ||
    checkPathStartsWith('/wishlist') ||
    checkPathStartsWith('/checkout');

  if (adminOnlyPath && (!session || isAdmin === false)) {
    if (checkPathStartsWith('/api/admin')) {
      return NextResponse.json({ success: false, message: 'Not Authorized.' });
    } else if (checkPathStartsWith('/admin-view')) {
      return NextResponse.redirect(new URL('/not-authorized', request.url));
    }
  }

  if (authorizedPath && !session) {
    return NextResponse.redirect(new URL('/not-authorized', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin-view/:path*', '/account', '/orders', '/wishlist', '/checkout/:path*'],
};
