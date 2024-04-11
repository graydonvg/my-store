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
    const cartItemId = searchParams.get('cart_item_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from cart. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemId)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from cart. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
      });

    const { error } = await supabase.from('cart').delete().eq('cartItemId', cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to remove item from cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Item remove from cart successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to remove item from cart. An unexpect error occured.',
    });
  }
}
