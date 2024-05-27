import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponseWithData, Product } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseWithData<Product[] | null>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .order('createdAt', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to get all products. ${error.message}.`,
        data: null,
      });
    }

    return NextResponse.json({ success: true, message: 'Fetched products sucessfully', data: products });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to get all products. An unexpect error occured.',
      data: null,
    });
  }
}
