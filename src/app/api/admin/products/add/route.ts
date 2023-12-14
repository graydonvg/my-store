import { NextResponse } from 'next/server';

import { CustomResponseType, InsertProductTypeDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<
  NextResponse<
    CustomResponseType<{
      product_id: string;
    }>
  >
> {
  const supabase = await createSupabaseServerClient();
  const formData: InsertProductTypeDb = await request.json();

  try {
    const { data, error } = await supabase.from('products').insert([formData]).select('product_id');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add product. ${error.message}.` });
    }

    const product_id = data[0];

    return NextResponse.json({ success: true, message: 'Product added successfully.', data: product_id });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add product. An unexpect error occured.' });
  }
}
