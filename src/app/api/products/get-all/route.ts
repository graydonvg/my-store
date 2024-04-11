import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';
import { CustomResponseType, ProductType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<CustomResponseType<ProductType[]>>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, index)')
      .order('index', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to get all products. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Fetched products sucessfully.', data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to get all products. An unexpect error occured.' });
  }
}
