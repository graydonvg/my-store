import { NextResponse } from 'next/server';
import { CustomResponseType, UpdateCartItemQuantityType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const cartItemData: UpdateCartItemQuantityType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update quantity. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to update quantity. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase
      .from('cart')
      .update({ quantity: cartItemData.quantity })
      .eq('cartItemId', cartItemData.cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update quantity. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated quantity successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update quantity. An unexpect error occured.' });
  }
}
