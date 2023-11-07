import { serverClientForRoute } from '@/lib/supabase-route';
import { CustomResponseType, ProductType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseType<ProductType[]>>> {
  try {
    const supabase = await serverClientForRoute();

    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_image_data(file_name, image_url, product_image_id, index)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to fetch products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An unexpect error occured' });
  }
}
