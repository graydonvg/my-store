import { NextResponse } from 'next/server';

import { InsertCartItemType, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const formData: InsertCartItemType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to add item to cart. ${notAuthenticatedError}` });

    if (!formData)
      return NextResponse.json({
        success: false,
        message: `Failed to update cart. ${noDataReceivedError}`,
      });

    const { error } = await supabase.from('cart').insert(formData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add item to cart. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Item added to cart successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add item to cart. An unexpect error occured.' });
  }
}
