import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';

// export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData: { email: string; password: string } = await request.json();
  const { email, password } = formData;

  if (session) return NextResponse.json({ status: 400, statusText: 'Please sign out before creating a new account' });

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ status: error.status, statusText: error.message });
    }

    return NextResponse.json({ status: 200, statusText: 'Sign up successful' });
  } catch (error) {
    return NextResponse.json({ status: 500, statusText: 'An unexpected error occurred' });
  }
}
