import { NextResponse } from 'next/server';

import { CustomResponseType, InserOrderType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<
  NextResponse<
    CustomResponseType<{
      order_id: string;
    }>
  >
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const orderData: InserOrderType = await request.json();

  if (!session)
    return NextResponse.json({ success: false, message: 'Failed to create order. Please try again later.' });

  try {
    const { error, data } = await supabase.from('orders').insert(orderData).select('order_id');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to create order. ${error.message}.` });
    }

    const order_id = data[0];

    return NextResponse.json({ success: true, message: 'Order created successfully.', data: order_id });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order. An unexpect error occured.' });
  }
}
