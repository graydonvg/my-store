import { NextResponse } from 'next/server';

import { CustomResponseType, DeleteOrderType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { order_id, user_id }: DeleteOrderType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: 'Failed to delete order. Please try again later.' });

    const { error } = await supabase.from('orders').delete().eq('order_id', order_id).eq('user_id', user_id);

    if (!!error) {
      return NextResponse.json({ success: false, message: `Failed to delete order. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete order. An unexpect error occured.',
    });
  }
}
