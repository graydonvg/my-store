import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const addressId: string = await request.json();

  try {
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
