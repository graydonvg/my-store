import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateProductType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const productData: UpdateProductType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update product. ${notAuthenticatedError}` });

    if (!productData)
      return NextResponse.json({ success: false, message: `Failed to update product. ${noDataReceivedError}` });

    const { error } = await supabase.from('products').update(productData).eq('productId', productData.productId!);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update product. An unexpect error occured.' });
  }
}
