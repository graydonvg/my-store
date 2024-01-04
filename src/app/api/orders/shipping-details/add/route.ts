import { NextResponse } from 'next/server';

import { CustomResponseType, InserOrderShippingDetailsType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const orderShippingDetails: InserOrderShippingDetailsType = await request.json();

  if (!session)
    return NextResponse.json({
      success: false,
      message: 'Failed to add order shipping details. Please try again later.',
    });

  try {
    const { error } = await supabase.from('shipping_details').insert(orderShippingDetails);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add order shipping details. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order shipping details added successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to add order shipping details. An unexpect error occured.',
    });
  }
}
