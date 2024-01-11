import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noIdReceivedError, notAuthenticatedError } from '@/constants/api';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const addressId: string = await request.json();

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
