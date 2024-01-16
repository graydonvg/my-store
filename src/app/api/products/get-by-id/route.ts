import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponseType, ProductType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<CustomResponseType<ProductType>>> {
  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('product_id');

  if (!productId)
    return NextResponse.json({ success: false, message: 'Failed to get product. Please provide a valid ID.' });

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .eq('productId', productId)
      .order('index', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: product[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
