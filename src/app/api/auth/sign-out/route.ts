import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import { serverClientForRoute } from '@/lib/supabase-route';

export async function GET(): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await serverClientForRoute();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return NextResponse.json({ success: false, message: 'Sign out failed. No user session exists.' });

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ success: false, message: `Sign out failed. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Sign out successful.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign out failed. An unexpected error occurred.' });
  }
}
