import { NextResponse } from 'next/server';

import { CustomResponseType, ProductImageDataStoreType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const imageData: ProductImageDataStoreType[] = await request.json();

  try {
    const updatePromises = imageData.map((data) =>
      supabase.from('product_image_data').update({ index: data.index }).eq('product_image_id', data.product_image_id!)
    );
    const [{ error }] = await Promise.all(updatePromises);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update image data. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product image data updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
