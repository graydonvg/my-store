import { NextResponse } from 'next/server';
import { CustomResponseType, UpdateCartItemSizeType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const cartItemData: UpdateCartItemSizeType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update size. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to update size. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase
      .from('cart')
      .update({ size: cartItemData.size })
      .eq('cartItemId', cartItemData.cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update size. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated size successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update size. An unexpect error occured.' });
  }
}
