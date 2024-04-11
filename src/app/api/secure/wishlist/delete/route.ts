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
    const wishlistItemId = searchParams.get('wishlist_item_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from wishlist. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!wishlistItemId)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from wishlist. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
      });

    const { error } = await supabase.from('wishlist').delete().eq('wishlistItemId', wishlistItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to remove item from wishlist. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Item remove from wishlist successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to remove item from wishlist. An unexpect error occured.',
    });
  }
}
