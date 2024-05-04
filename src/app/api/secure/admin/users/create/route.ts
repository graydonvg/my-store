import { NextResponse } from 'next/server';
import { UpdateUserPersonalInformationDb, AdminCreateUserResponse, CustomResponse, UserAuthData } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';

export async function POST(request: Request): Promise<NextResponse<CustomResponse<AdminCreateUserResponse>>> {
  const supabaseAuth = await createSupabaseServerClient();
  const supabaseSerice = createSupabaseService();

  try {
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    const { data: authorizationData } = await supabaseAuth.from('users').select('admins(userId), managers(userId)');
    const isAuthorized =
      authorizationData && (authorizationData[0].admins.length > 0 || authorizationData[0].managers.length > 0);

    const userData: UserAuthData & UpdateUserPersonalInformationDb = await request.json();
    const { email, password, ...userDataToUpdate } = userData;
    const emptyFiledsArray = getEmptyFormFields(userDataToUpdate);
    const numberOfFromFields = getNumberOfFormFields(userDataToUpdate);
    const hasDataToUpdate = emptyFiledsArray.length !== numberOfFromFields;

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to create user. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!isAuthorized)
      return NextResponse.json({
        success: false,
        message: 'Failed to create user. Not authorized.',
      });

    if (!userData)
      return NextResponse.json({
        success: false,
        message: `Failed to create user. ${ERROR_MESSAGES.NO_DATA_RECEIVED}`,
      });

    const { data: createUserData, error: createUserError } = await supabaseSerice.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      return NextResponse.json({ success: false, message: `Failed to create user. ${createUserError.message}.` });
    }

    if (hasDataToUpdate) {
      const { error: updateUserError } = await supabaseSerice
        .from('users')
        .update(userDataToUpdate)
        .eq('userId', createUserData.user.id);

      if (updateUserError) {
        return NextResponse.json({
          success: false,
          message: `Auth user created successfully, but failed to update users table. ${updateUserError.message}.`,
        });
      }
    }

    if (userDataToUpdate.role && userDataToUpdate.role === 'admin') {
      const { error: userAdminRoleError } = await supabaseSerice
        .from('admins')
        .insert({ userId: createUserData.user.id });

      if (userAdminRoleError) {
        return NextResponse.json({
          success: false,
          message: `User created successfully, but failed to set role. ${userAdminRoleError.message}.`,
        });
      }
    }

    if (userDataToUpdate.role && userDataToUpdate.role === 'manager') {
      const { error: userAdminRoleError } = await supabaseSerice
        .from('managers')
        .insert({ userId: createUserData.user.id });

      if (userAdminRoleError) {
        return NextResponse.json({
          success: false,
          message: `User created successfully, but failed to set role. ${userAdminRoleError.message}.`,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'User created successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create user. An unexpect error occured.' });
  }
}
