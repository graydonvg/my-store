import { NextResponse } from 'next/server';
import { CustomResponse, UpdateOrderStatus } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const orderData: UpdateOrderStatus = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to update order status. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!orderData)
      return NextResponse.json({
        success: false,
        message: `Failed to update order status. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase
      .from('orders')
      .update({ orderStatus: orderData.orderStatus })
      .eq('orderId', orderData.orderId)
      .eq('userId', authUser.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update order status. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order status updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update order status. An unexpect error occured.',
    });
  }
}
