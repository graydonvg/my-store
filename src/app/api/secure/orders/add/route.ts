import { NextResponse } from 'next/server';
import { InsertOrderDb, AddOrderResponse, CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse<AddOrderResponse>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const orderData: InsertOrderDb = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to create order. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!orderData)
      return NextResponse.json({
        success: false,
        message: `Failed to create order. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error, data } = await supabase
      .from('orders')
      .insert({ ...orderData.orderDetails })
      .select('orderId');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to create order. ${error.message}.` });
    }

    const { orderId } = data[0];

    const modifiedOrderItems = orderData.orderItems.map((item) => {
      return {
        ...item,
        orderId: orderId,
      };
    });

    const insertOrderItemsPromise = supabase.from('orderItems').insert(modifiedOrderItems);

    const insertShippingDetailsPromise = supabase
      .from('shippingDetails')
      .insert({ ...orderData.shippingDetails, orderId: orderId });

    const [insertOrderItemsResponse, insertShippingDetailsResponse] = await Promise.all([
      insertOrderItemsPromise,
      insertShippingDetailsPromise,
    ]);

    if (insertOrderItemsResponse.error || insertShippingDetailsResponse.error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create order. Failed to add order items and shipping details.',
      });
    } else if (insertOrderItemsResponse.error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create order. Failed to add order items.',
      });
    } else if (insertShippingDetailsResponse.error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create order. Failed to add shipping details.',
      });
    } else {
      return NextResponse.json({ success: true, message: 'Order created successfully', data: { orderId } });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order. An unexpect error occured.' });
  }
}
