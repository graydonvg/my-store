import { NextResponse } from 'next/server';

import { CustomResponseType, UserAuthType } from '@/types';
import { createSupabaseServerClientForAuth } from '@/lib/supabase/supabase-server-auth';
import { noDataReceivedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClientForAuth();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const signUpData: UserAuthType = await request.json();

    if (session)
      return NextResponse.json({
        success: false,
        message: 'Sign up failed. Please sign out before creating a new account.',
      });

    if (!signUpData)
      return NextResponse.json({
        success: false,
        message: `Sign up failed. ${noDataReceivedError}`,
      });

    const { error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
    });

    if (error) {
      return NextResponse.json({ success: false, message: `Sign up failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign up successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign up failed. An unexpected error occurred.' });
  }
}
