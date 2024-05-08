import { NextRequest, NextResponse } from 'next/server';
import { CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

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
