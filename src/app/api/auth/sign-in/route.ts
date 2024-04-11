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

    const signInData: UserAuthType = await request.json();

    if (user)
      return NextResponse.json({
        success: false,
        message: 'Sign in failed. A user session already exists.',
      });

    if (!signInData)
      return NextResponse.json({
        success: false,
        message: `Sign in failed. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password,
    });

    if (error) {
      return NextResponse.json({ success: false, message: `Sign in failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign in successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign in failed. An unexpected error occurred.' });
  }
}
