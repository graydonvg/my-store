import { NextResponse } from 'next/server';

import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const imageData: InsertProductImageDataTypeStore[] = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update image data. ${notAuthenticatedError}` });

    if (!imageData)
      return NextResponse.json({ success: false, message: `Failed to update image data. ${noDataReceivedError}` });

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
