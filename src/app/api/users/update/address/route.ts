import { NextResponse } from 'next/server';

import { CustomResponseType, UpdateAddressTypeDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData: UpdateAddressTypeDb = await request.json();

  if (!session)
    return NextResponse.json({
      success: false,
      message: 'Failed to update address. Please try again later.',
    });

  try {
    const { error } = await supabase.from('addresses').update(formData).eq('address_id', formData.address_id!);

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
