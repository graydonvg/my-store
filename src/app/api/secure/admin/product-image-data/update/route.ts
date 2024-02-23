import { NextResponse } from 'next/server';

import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const imageData: InsertProductImageDataTypeStore[] = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update image data. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!imageData)
      return NextResponse.json({
        success: false,
        message: `Failed to update image data. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const updatePromises = imageData.map((data) =>
      supabase.from('productImageData').update(data).eq('productImageId', data.productImageId!)
    );

    const [{ error }] = await Promise.all(updatePromises);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update image data. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product image data updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update image data. An unexpect error occured.' });
  }
}
