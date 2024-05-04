import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { CustomResponse, Product } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponse<Product[]>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .eq('isOnSale', 'Yes')
      .order('salePercentage', { ascending: false })
      .order('index', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all sale products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Fetched products sucessfully.', data: products });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to get all sale products. An unexpect error occured.',
    });
  }
}
