import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function DELETE(): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to clear cart. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    const { error } = await supabase.from('cart').delete().eq('userId', session.user.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to clear cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Cart cleared successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to clear cart. An unexpect error occured.',
    });
  }
}
