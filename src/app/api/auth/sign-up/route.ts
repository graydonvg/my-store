import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';

// export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData: { email: string; password: string } = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { email, password } = formData;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ status: error.status, statusText: error.message });
    }

    return NextResponse.json({ status: 200, statusText: 'Sign up successful', userId: data.user?.id });
  } catch (error) {
    return NextResponse.json({ status: 500, statusText: 'An unexpected error occurred.' });
  }
}
