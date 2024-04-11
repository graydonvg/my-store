import { NextRequest, NextResponse } from 'next/server';
import { CustomResponseType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to delete order. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!orderId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete order. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
      });

    const { error } = await supabase.from('orders').delete().eq('orderId', orderId).eq('userId', user.id);

    if (error) {
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
