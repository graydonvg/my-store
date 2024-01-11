import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateProductType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  const productData: UpdateProductType = await request.json();

  try {
    const { error } = await supabase.from('products').update(productData).eq('productId', productData.productId!);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update product. An unexpect error occured.' });
  }
}
