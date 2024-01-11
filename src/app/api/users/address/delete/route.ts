import { NextRequest, NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noIdReceivedError, notAuthenticatedError } from '@/constants/api';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const searchParams = request.nextUrl.searchParams;
    const addressId = searchParams.get('address_id');

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to delete address. ${notAuthenticatedError}`,
      });

    if (!addressId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete address. ${noIdReceivedError}`,
      });

    const { error } = await supabase.from('addresses').delete().eq('addressId', addressId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to delete address. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete address. An unexpect error occured.',
    });
  }
}
