import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateCartItemQuantityType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const data: UpdateCartItemQuantityType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update quantity. ${notAuthenticatedError}` });

    if (!data)
      return NextResponse.json({ success: false, message: `Failed to update quantity. ${noDataReceivedError}` });

    const { error } = await supabase.from('cart').update({ quantity: data.quantity }).eq('cartItemId', data.cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update quantity. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated quantity successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update quantity. An unexpect error occured.' });
  }
}
