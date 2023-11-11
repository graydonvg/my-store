import { createSupabaseServerClientForAuth } from '@/lib/supabase/supabase-server-auth';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createSupabaseServerClientForAuth();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, request.url));
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/', request.url));
}
