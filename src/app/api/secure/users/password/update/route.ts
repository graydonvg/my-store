import { NextResponse } from 'next/server';

import { CustomResponseType, userPasswordType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ERROR_MESSAGES } from '@/config';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const passwordData: userPasswordType = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to update password. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!passwordData)
      return NextResponse.json({
        success: false,
        message: `Failed to update password. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { data: success } = await supabase.rpc('verifyUserPassword', {
      password: passwordData.currentPassword,
    });

    if (success === true && passwordData.newPassword === passwordData.confirmPassword) {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });

      if (error) {
        return NextResponse.json({ success: false, message: `Failed to update password. ${error.message}.` });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: `Failed to update password. The password you have entered is incorrect.`,
      });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update password. An unexpect error occured.' });
  }
}
