import { NextResponse } from 'next/server';

import { AddProductResponseType, CustomResponseType, InsertProductTypeDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType<AddProductResponseType>>> {
  const supabase = await createSupabaseServerClient();

  const formData: InsertProductTypeDb = await request.json();

  try {
    const { data, error } = await supabase.from('products').insert(formData).select('productId');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add product. ${error.message}.` });
    }

    const productId = data[0];

    return NextResponse.json({ success: true, message: 'Product added successfully.', data: productId });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add product. An unexpect error occured.' });
  }
}
