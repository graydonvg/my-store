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

    const formData: UserAuthType = await request.json();

    if (session)
      return NextResponse.json({
        success: false,
        message: 'Sign in failed. A user session already exists.',
      });

    if (!formData)
      return NextResponse.json({
        success: false,
        message: `Sign in failed. ${noDataReceivedError}`,
      });

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
