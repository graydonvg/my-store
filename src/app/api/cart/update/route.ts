import { NextResponse } from 'next/server';

import { UpdateCartItemDbType, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const data: UpdateCartItemDbType = await request.json();

  if (!session)
    return NextResponse.json({ success: false, message: 'Failed to update cart item. Please try again later.' });

  try {
    const { error } = await supabase
      .from('cart')
      .update({ quantity: data.quantity, size: data.size })
      .eq('cart_item_id', data.cart_item_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update cart item. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated cart item successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update cart item. An unexpect error occured.' });
  }
}
