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
