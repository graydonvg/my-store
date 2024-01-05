import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateOrderType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { order_id, is_paid }: UpdateOrderType = await request.json();
    const { error } = await supabase.from('orders').update({ is_paid }).eq('order_id', order_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update order. ${error.message}.` });
    }

    console.log('update order server', error);

    return NextResponse.json({ success: true, message: 'Order updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update order. An unexpect error occured.' });
  }
}
