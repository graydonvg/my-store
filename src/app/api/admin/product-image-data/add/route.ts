import { NextResponse } from 'next/server';

import { InsertProductImageDataTypeDb, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const imageData: InsertProductImageDataTypeDb[] = await request.json();

  console.log('data', imageData);

  try {
    const { error } = await supabase.from('product_image_data').insert(imageData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add image data to database. ${error.message}.` });
    }

    console.log('added!');

    return NextResponse.json({ success: true, message: 'Product image data added successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to add image data to database. An unexpect error occured.',
    });
  }
}
