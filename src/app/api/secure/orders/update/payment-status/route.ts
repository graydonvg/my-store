import { NextResponse } from 'next/server';
import { CustomResponseType, UpdateOrderType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderData: UpdateOrderType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update order payment status. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!orderData)
      return NextResponse.json({
        success: false,
        message: `Failed to update order payment status. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase
      .from('orders')
      .update({ isPaid: orderData.isPaid })
      .eq('orderId', orderData.orderId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update order payment status. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order payment status updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update order payment status. An unexpect error occured.',
    });
  }
}
