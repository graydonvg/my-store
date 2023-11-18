import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponseType, ProductType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<CustomResponseType<ProductType>>> {
  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const product_id = searchParams.get('product_id');

  if (!product_id)
    return NextResponse.json({ success: false, message: 'Failed to get product. Please provide a valid ID.' });

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, product_image_data(file_name, image_url, product_image_id)')
      .eq('product_id', product_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: product[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
