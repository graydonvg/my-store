import { NextResponse } from 'next/server';

import { CustomResponseType, InserOrderItemsType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const orderItemsData: InserOrderItemsType = await request.json();

  if (!session)
    return NextResponse.json({ success: false, message: 'Failed to add order items. Please try again later.' });

  try {
    const { error } = await supabase.from('orderItems').insert(orderItemsData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add order items. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order items added successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add order items. An unexpect error occured.' });
  }
}
