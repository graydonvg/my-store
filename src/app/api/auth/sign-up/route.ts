import { NextResponse } from 'next/server';

import { CustomResponseType, UserAuthType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const signUpData: UserAuthType = await request.json();

    if (user)
      return NextResponse.json({
        success: false,
        message: 'Sign up failed. Please sign out before creating a new account.',
      });

    if (!signUpData)
      return NextResponse.json({
        success: false,
        message: `Sign up failed. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
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
