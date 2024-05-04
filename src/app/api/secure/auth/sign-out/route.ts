import { NextResponse } from 'next/server';

import { CustomResponse } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function GET(): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, message: 'Sign out failed. No user session exists.' });

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ success: false, message: `Sign out failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign out successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign out failed. An unexpected error occurred.' });
  }
}
