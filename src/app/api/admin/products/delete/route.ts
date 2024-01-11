import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noIdReceivedError, notAuthenticatedError } from '@/constants/api';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const productId: string = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to delete product. ${notAuthenticatedError}` });

    if (!productId)
      return NextResponse.json({ success: false, message: `Failed to delete product. ${noIdReceivedError}` });

    const { error } = await supabase.from('products').delete().eq('productId', productId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete product. An unexpect error occured.' });
  }
}
