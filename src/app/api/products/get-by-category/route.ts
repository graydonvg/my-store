import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponseType, ProductType } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<CustomResponseType<ProductType[]>>> {
  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  if (!category)
    return NextResponse.json({ success: false, message: 'Failed to get products. Please provide a valid category.' });

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId)')
      .eq('category', category)
      .order('createdAt', { ascending: false });
    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
