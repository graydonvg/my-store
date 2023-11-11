import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const product_image_id: string = await request.json();

  try {
    const { error } = await supabase.from('product_image_data').delete().eq('product_image_id', product_image_id);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to delete image data from database. ${error.message}.`,
      });
    }

    return NextResponse.json({ success: true, message: 'Product image data deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
