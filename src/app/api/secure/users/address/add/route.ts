import { NextResponse } from 'next/server';
import { CustomResponseType, InsertAddressType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const addressData: InsertAddressType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to add address. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!addressData)
      return NextResponse.json({
        success: false,
        message: `Failed to add address. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('addresses').insert(addressData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add address. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Address added successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add address. An unexpect error occured.' });
  }
}
