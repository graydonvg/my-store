import { NextResponse } from 'next/server';
import { CustomResponse, UpdateCartItemSize } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const cartItemData: UpdateCartItemSize = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to update size. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!cartItemData)
      return NextResponse.json({
        success: false,
        message: `Failed to update size. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase
      .from('cart')
      .update({ size: cartItemData.size })
      .eq('cartItemId', cartItemData.cartItemId);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update size. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Updated size successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update size. An unexpect error occured.' });
  }
}
