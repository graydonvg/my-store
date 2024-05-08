import { NextResponse } from 'next/server';
import { CustomResponse, UpdateProductDb } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const productData: UpdateProductDb = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to update product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productData)
      return NextResponse.json({
        success: false,
        message: `Failed to update product. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('products').update(productData).eq('productId', productData.productId!);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update product. An unexpect error occured.' });
  }
}
