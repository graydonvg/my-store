import { NextResponse } from 'next/server';

import { CustomResponseType, InsertShippingDetailsType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const formData: InsertShippingDetailsType = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to add order shipping details. ${notAuthenticatedError}`,
      });

    if (!formData)
      return NextResponse.json({
        success: false,
        message: `Failed to add order shipping details. ${noDataReceivedError}`,
      });

    const { error } = await supabase.from('shippingDetails').insert(formData);

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
