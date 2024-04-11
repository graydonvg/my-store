import { NextRequest, NextResponse } from 'next/server';
import { CustomResponseType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: NextRequest): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const addressId = searchParams.get('address_id');

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to delete address. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!addressId)
      return NextResponse.json({
        success: false,
        message: `Failed to delete address. ${ERROR_MESSAGES.NO_ID_RECEIVED}`,
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
