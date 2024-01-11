import { NextResponse } from 'next/server';

import { CustomResponseType, userPasswordType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const formData: userPasswordType = await request.json();

    if (!session)
      return NextResponse.json({ success: false, message: `Failed to update password. ${notAuthenticatedError}` });

    if (!formData)
      return NextResponse.json({ success: false, message: `Failed to update password. ${noDataReceivedError}` });

    const { data: success } = await supabase.rpc('verifyUserPassword', {
      password: formData.currentPassword,
    });

    if (success === true && formData.newPassword === formData.confirmPassword) {
      const { error } = await supabase.auth.updateUser({ password: formData.newPassword });

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
