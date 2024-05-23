import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponse, Product } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse<CustomResponse<Product[]>>> {
  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  if (!category)
    return NextResponse.json({ success: false, message: 'Failed to get products. Please provide a valid category.' });

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .eq('category', category)
      .order('createdAt', { ascending: false })
      .order('index', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Fetched products sucessfully', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
