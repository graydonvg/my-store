import { serverClientForRoute } from '@/lib/supabase-route';
import { CurrentUserType, CustomResponseType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseType<CurrentUserType>>> {
  const supabase = await serverClientForRoute();

  try {
    const { data: user, error } = await supabase.from('users').select('*');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get user. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: user[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get user. An unexpect error occured.' });
  }
}
