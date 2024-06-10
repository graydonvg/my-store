import { NextResponse } from 'next/server';

import { CustomResponse, UpdateUserDb, UserAuthData } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyObjectKeys } from '@/utils/checkForms';
import { getObjectKeyCount } from '@/utils/checkForms';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userData: UserAuthData & UpdateUserDb = await request.json();
    const { email, password, ...userDataToUpdate } = userData;
    const emptyFormFields = getEmptyObjectKeys(userDataToUpdate);
    const numberOfFromFields = getObjectKeyCount(userDataToUpdate);
    const hasDataToUpdate = emptyFormFields.length !== numberOfFromFields;

    if (authUser)
      return NextResponse.json({
        success: false,
        message: 'Sign up failed. Please sign out before creating a new account.',
      });

    if (!userData)
      return NextResponse.json({
        success: false,
        message: `Sign up failed. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      return NextResponse.json({ success: false, message: `Sign up failed. ${signUpError.message}.` });
    }

    if (hasDataToUpdate) {
      const userId = signUpData?.user?.id ?? '';

      const { error: updateUserError } = await supabase.from('users').update(userDataToUpdate).eq('userId', userId);

      if (updateUserError) {
        return NextResponse.json({
          success: false,
          message: `Sign up successful, but failed to insert name and contact number. ${updateUserError.message}.`,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Sign up successful' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Sign up failed. An unexpected error occurred.' });
  }
}
