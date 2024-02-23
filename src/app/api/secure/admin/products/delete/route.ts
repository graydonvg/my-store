import { NextRequest, NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to delete product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete product. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
      });

    const { error } = await supabase.from('products').delete().eq('productId', productId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete product. An unexpect error occured.' });
  }
}
