import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateAddressTypeDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const addressData: UpdateAddressTypeDb = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: 'Failed to update address. Please try again later.',
      });

    if (!addressData)
      return NextResponse.json({
        success: false,
        message: `Failed to update address. ${noDataReceivedError}`,
      });

    const { error } = await supabase.from('addresses').update(addressData).eq('addressId', addressData.addressId!);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update address. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Address updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update address. An unexpect error occured.',
    });
  }
}
