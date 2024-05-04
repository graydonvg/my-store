import { NextResponse } from 'next/server';
import { CustomResponse, InsertWishlistItemDb } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const wishlistItemData: InsertWishlistItemDb = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to add item to wishlist. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!wishlistItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to update wishlist. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('wishlist').insert(wishlistItemData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add item to wishlist. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Item added to wishlist successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add item to wishlist. An unexpect error occured.' });
  }
}
