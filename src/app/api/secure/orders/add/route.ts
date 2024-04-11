import { NextResponse } from 'next/server';
import { AddOrderType, AddOrderResponseType, CustomResponseType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType<AddOrderResponseType>>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderData: AddOrderType = await request.json();

    if (!user)
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
      .insert({ ...orderData.orderDetails, userId: user.id })
      .select('orderId');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to create order. ${error.message}.` });
    }

    const { orderId } = data[0];

    const createOrderItems = orderData.orderItems.map((item) => {
      return {
        ...item,
        userId: user.id,
        orderId: orderId,
      };
    });

    const insertOrderItemsPromise = supabase.from('orderItems').insert(createOrderItems);
    const insertShippingDetailsPromise = supabase
      .from('shippingDetails')
      .insert({ ...orderData.shippingDetails, userId: user.id, orderId: orderId });

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
      return NextResponse.json({ success: true, message: 'Order created successfully.', data: { orderId } });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create order. An unexpect error occured.' });
  }
}
