import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const cartItemId: string = await request.json();

  try {
    const { error } = await supabase.from('cart').delete().eq('cart_item_id', cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete product from cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product deleted from cart successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete product from cart. An unexpect error occured.',
    });
  }
}
