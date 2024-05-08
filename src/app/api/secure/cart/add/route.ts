import { NextResponse } from 'next/server';
import { InsertCartItemDb, CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const cartItemData: InsertCartItemDb = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to add item to cart. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to add item to cart. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('cart').insert(cartItemData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add item to cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Item added to cart successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add item to cart. An unexpect error occured.' });
  }
}
