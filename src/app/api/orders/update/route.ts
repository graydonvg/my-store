import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateOrderType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { orderId, isPaid }: UpdateOrderType = await request.json();
    const { error } = await supabase.from('orders').update({ isPaid }).eq('orderId', orderId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update order. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update order. An unexpect error occured.' });
  }
}
