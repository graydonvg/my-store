import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  const productImageId: string = await request.json();

  try {
    const { error } = await supabase.from('productImageData').delete().eq('productImageId', productImageId);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to delete image data from database. ${error.message}.`,
      });
    }

    return NextResponse.json({ success: true, message: 'Product image data deleted successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete image data from database. An unexpect error occured.',
    });
  }
}
