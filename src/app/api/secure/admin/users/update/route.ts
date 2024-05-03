import { NextResponse } from 'next/server';
import { CustomResponseType, UpdateUserPersonalInformationType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
// import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import getUserRoleFromSession from '@/utils/getUserRoleFromSession';
import getUserRoleBoolean from '@/utils/getUserRoleBoolean';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  // const supabaseSerice = createSupabaseService();

  try {
    const {
      data: { user: userAuth },
    } = await supabase.auth.getUser();

    // const { data: authorizationData } = await supabase.from('users').select('admins(userId), managers(userId)');

    const userData: UpdateUserPersonalInformationType = await request.json();
    const { userId, ...userDataToUpdate } = userData;

    if (!userAuth)
      return NextResponse.json({
        success: false,
        message: `Failed to update user personal information. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    const userRole = userAuth ? await getUserRoleFromSession(supabase) : null;
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(userRole);

    if (!isAdmin || !isManager || !isOwner)
      return NextResponse.json({
        success: false,
        message: 'Failed to update user personal information. Not authorized.',
      });

    if (!userDataToUpdate)
      return NextResponse.json({
        success: false,
        message: `Failed update user personal information. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    if (!userId)
      return NextResponse.json({
        success: false,
        message: `Failed update user personal information. Please provide a valid user ID.`,
      });

    const { error } = await supabase.from('users').update(userDataToUpdate).eq('userId', userId);

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Failed to update user personal information. ${error.message}.`,
      });
    }

    return NextResponse.json({ success: true, message: 'User personal information updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update user personal information. An unexpect error occured.',
    });
  }
}
