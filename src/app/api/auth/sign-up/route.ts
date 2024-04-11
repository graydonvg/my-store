import { NextResponse } from 'next/server';

import { CustomResponseType, UserAuthType } from '@/types';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

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
