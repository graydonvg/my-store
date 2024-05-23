import { NextResponse } from 'next/server';
import { AddProductResponse, CustomResponse, InsertProductDb } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse<AddProductResponse>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const productData: InsertProductDb = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to add product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productData)
      return NextResponse.json({
        success: false,
        message: `Failed to add product. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { data, error } = await supabase.from('products').insert(productData).select('productId');

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add product. ${error.message}.` });
    }

    const productId = data[0];

    return NextResponse.json({ success: true, message: 'Product added successfully', data: productId });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add product. An unexpect error occured.' });
  }
}
