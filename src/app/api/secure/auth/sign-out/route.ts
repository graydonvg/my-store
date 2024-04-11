import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function GET(): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

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
