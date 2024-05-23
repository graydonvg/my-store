import { NextResponse } from 'next/server';
import { CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to clear cart. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    const { error } = await supabase.from('cart').delete().eq('userId', authUser.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to clear cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to clear cart. An unexpect error occured.',
    });
  }
}
