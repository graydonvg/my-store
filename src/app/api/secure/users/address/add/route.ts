import { NextResponse } from 'next/server';
import { CustomResponse, InsertAddressDb } from '@/types';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const addressData: InsertAddressDb = await request.json();

    if (!authUser)
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
