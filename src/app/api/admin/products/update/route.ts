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

    const formData: UpdateProductType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update product. ${notAuthenticatedError}` });

    if (!formData)
      return NextResponse.json({ success: false, message: `Failed to update product. ${noDataReceivedError}` });

    const { error } = await supabase.from('products').update(formData).eq('productId', formData.productId!);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update product. An unexpect error occured.' });
  }
}
