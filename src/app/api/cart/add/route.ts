import { NextResponse } from 'next/server';

import { AddCartItemDbType, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const cartItem: AddCartItemDbType = await request.json();

  if (!session) return NextResponse.json({ success: false, message: 'Failed to update cart. Please try again later.' });

  try {
    const { data, error } = await supabase.from('cart').insert([cartItem]);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Cart updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update cart. An unexpect error occured.' });
  }
}
