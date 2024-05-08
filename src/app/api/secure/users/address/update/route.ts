import { NextResponse } from 'next/server';
import { CustomResponse, UpdateAddressDb } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const addressData: UpdateAddressDb = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: 'Failed to update address. Please try again later.',
      });

    if (!addressData)
      return NextResponse.json({
        success: false,
        message: `Failed to update address. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
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
