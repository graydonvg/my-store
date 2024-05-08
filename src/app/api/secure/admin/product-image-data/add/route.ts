import { NextResponse } from 'next/server';
import { InsertProductImageDataDb, CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const imageData: InsertProductImageDataDb[] = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to add image data to database. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!imageData)
      return NextResponse.json({
        success: false,
        message: `Failed to add image data to database. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
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
