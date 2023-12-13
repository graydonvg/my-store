import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const data: {
    cart_item_id: string;
    quantity: number;
  } = await request.json();

  if (!session)
    return NextResponse.json({ success: false, message: 'Failed to update quantity. Please try again later.' });

  try {
    const { error } = await supabase
      .from('cart')
      .update({ quantity: data.quantity })
      .eq('cart_item_id', data.cart_item_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update quantity. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated quantity successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update quantity. An unexpect error occured.' });
  }
}
