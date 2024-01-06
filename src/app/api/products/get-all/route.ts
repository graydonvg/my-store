import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponseType, ProductType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseType<ProductType[]>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId)')
      .order('createdAt', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: '', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
