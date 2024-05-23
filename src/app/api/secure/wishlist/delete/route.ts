import { NextRequest, NextResponse } from 'next/server';
import { CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const wishlistItemId = searchParams.get('wishlist_item_id');

    if (!authUser)
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
