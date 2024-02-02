import { NextRequest, NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noIdReceivedError, notAuthenticatedError } from '@/constants/api';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to delete order. ${notAuthenticatedError}` });

    if (!orderId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete order. ${noIdReceivedError}`,
      });

    const { error } = await supabase.from('orders').delete().eq('orderId', orderId).eq('userId', session.user.id);

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
