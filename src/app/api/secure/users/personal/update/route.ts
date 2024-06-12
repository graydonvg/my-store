import { NextResponse } from 'next/server';
import { CustomResponse, UpdateUserData } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function PUT(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const personalData: UpdateUserData = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!personalData)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { error } = await supabase.from('users').update(personalData).eq('userId', authUser.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update personal information. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Personal information updated successfully' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update personal information. An unexpect error occured.',
    });
  }
}
