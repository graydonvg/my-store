import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import { createSupabaseServerClientForAuth } from '@/lib/supabase/supabase-server-auth';

export async function GET(): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClientForAuth();

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
