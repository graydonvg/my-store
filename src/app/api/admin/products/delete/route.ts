import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const productId: string = await request.json();

  try {
    const { error } = await supabase.from('products').delete().eq('productId', productId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete product. An unexpect error occured.' });
  }
}
