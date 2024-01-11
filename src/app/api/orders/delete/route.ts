import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function DELETE(request: Request): Promise<NextResponse<CustomResponseType>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const orderId: string = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: 'Failed to delete order. No user session exists' });

    const { error } = await supabase.from('orders').delete().eq('orderId', orderId).eq('userId', session.user.id);

    if (!!error) {
      return NextResponse.json({ success: false, message: `Failed to delete order. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to delete order. An unexpect error occured.',
    });
  }
}
