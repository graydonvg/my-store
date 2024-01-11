import { NextResponse } from 'next/server';

import { CustomResponseType, UserAuthType } from '@/types';
import { createSupabaseServerClientForAuth } from '@/lib/supabase/supabase-server-auth';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClientForAuth();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const formData: UserAuthType = await request.json();

  if (session) return NextResponse.json({ success: false, message: 'Sign in failed. A user session already exists.' });

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      return NextResponse.json({ success: false, message: `Sign in failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign in successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign in failed. An unexpected error occurred.' });
  }
}
