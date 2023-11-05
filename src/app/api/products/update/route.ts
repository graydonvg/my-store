import { NextResponse } from 'next/server';

import { serverClientForRoute } from '@/lib/supabase-route';
import { CustomResponseType, UpdateProductType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await serverClientForRoute();
  const formData: UpdateProductType = await request.json();

  try {
    const { error } = await supabase.from('products').update(formData).eq('product_id', formData.product_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
