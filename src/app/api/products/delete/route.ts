import { NextResponse } from 'next/server';

import { serverClientForRoute } from '@/lib/supabase-route';
import { CustomResponseType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await serverClientForRoute();
  const product_id: string = await request.json();

  try {
    const { error } = await supabase.from('products').delete().eq('product_id', product_id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete product. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
