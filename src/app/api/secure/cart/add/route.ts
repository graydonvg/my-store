import { NextResponse } from 'next/server';

import { InsertCartItemType, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const cartItemData: InsertCartItemType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to add item to cart. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to update cart. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
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
