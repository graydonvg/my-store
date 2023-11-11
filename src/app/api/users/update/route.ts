import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData = await request.json();

  if (!session) return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });

  try {
    const { error } = await supabase.from('users').update(formData).eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update user. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
