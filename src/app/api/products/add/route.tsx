import { NextResponse } from 'next/server';

import { serverClientForRoute } from '@/lib/supabase-route';
import { AddProductDbType, CustomResponseType, UpdateProductType } from '@/types';

export async function POST(request: Request): Promise<
  NextResponse<
    CustomResponseType<{
      product_id: string;
    }>
  >
> {
  const supabase = await serverClientForRoute();
  const formData: AddProductDbType = await request.json();

  try {
    const { data, error } = await supabase.from('products').insert([formData]).select('product_id');

    if (error) {
      return NextResponse.json({ success: false, message: error.message });
    }

    const product_id = data[0];

    return NextResponse.json({ success: true, message: 'Product added successfully.', data: product_id });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
