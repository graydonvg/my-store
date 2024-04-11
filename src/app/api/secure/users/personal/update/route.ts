import { NextResponse } from 'next/server';
import { CustomResponseType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/supabase-route-handler';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseRouteHandlerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const personalData: { firstName: string; lastName: string } = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!personalData)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('users').update(personalData).eq('userId', user.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update personal information. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Personal information updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update personal information. An unexpect error occured.',
    });
  }
}
