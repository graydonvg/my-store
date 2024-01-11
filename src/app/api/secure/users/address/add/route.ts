import { NextResponse } from 'next/server';
import { CustomResponseType, InsertAddressType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const addressData: InsertAddressType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to add address. ${notAuthenticatedError}` });

    if (!addressData)
      return NextResponse.json({ success: false, message: `Failed to add address. ${noDataReceivedError}` });

    const { error } = await supabase.from('addresses').insert(addressData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add address. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Address added successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add address. An unexpect error occured.' });
  }
}
