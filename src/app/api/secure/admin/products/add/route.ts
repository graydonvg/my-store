import { NextResponse } from 'next/server';

import { AddProductResponseType, CustomResponseType, InsertProductTypeDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType<AddProductResponseType>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const productData: InsertProductTypeDb = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to add product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productData)
      return NextResponse.json({
        success: false,
        message: `Failed to add product. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { data, error } = await supabase.from('products').insert(productData).select('productId');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add product. ${error.message}.` });
    }

    const productId = data[0];

    return NextResponse.json({ success: true, message: 'Product added successfully.', data: productId });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add product. An unexpect error occured.' });
  }
}
