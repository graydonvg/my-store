import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';

// export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { user_name, first_name, last_name, email, password } = formData;

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        data: { user_name, first_name, last_name },
      },
    });

    if (error) {
      return new NextResponse(null, { status: error.status, statusText: error.message });
    }

    return new NextResponse(null, { status: 200, statusText: 'Sign up successful' });
  } catch (error) {
    return new NextResponse(null, { status: 500, statusText: 'An unexpected error occurred.' });
  }
}
