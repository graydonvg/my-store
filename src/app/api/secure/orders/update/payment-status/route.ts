import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateOrderType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const orderData: UpdateOrderType = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to update order payment status. ${notAuthenticatedError}`,
      });

    if (!orderData)
      return NextResponse.json({
        success: false,
        message: `Failed to update order payment status. ${noDataReceivedError}`,
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
