import { NextResponse } from 'next/server';

import { InsertProductImageDataTypeDb, CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const imageData: InsertProductImageDataTypeDb[] = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to add image data to database. ${notAuthenticatedError}`,
      });

    if (!imageData)
      return NextResponse.json({
        success: false,
        message: `Failed to add image data to database. ${noDataReceivedError}`,
      });

    const { error } = await supabase.from('productImageData').insert(imageData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add image data to database. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product image data added successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to add image data to database. An unexpect error occured.',
    });
  }
}
