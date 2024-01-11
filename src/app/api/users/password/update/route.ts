import { NextResponse } from 'next/server';

import { CustomResponseType, userPasswordType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData: userPasswordType = await request.json();

  if (!session)
    return NextResponse.json({ success: false, message: 'Failed to update password. Please try again later.' });

  try {
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
