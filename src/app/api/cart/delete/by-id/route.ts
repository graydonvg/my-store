import { NextRequest, NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noIdReceivedError, notAuthenticatedError } from '@/constants/api';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const searchParams = request.nextUrl.searchParams;
    const cartItemId = searchParams.get('cart_item_id');

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from cart. ${notAuthenticatedError}`,
      });

    if (!cartItemId)
      return NextResponse.json({
        success: false,
        message: `Failed to remove item from cart. ${noIdReceivedError}`,
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
