import { NextResponse } from 'next/server';
import { UpdateUserPersonalInformationType, CreateUserResponseType, CustomResponseType, UserAuthType } from '@/types';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType<CreateUserResponseType>>> {
  const supabaseAuth = await createSupabaseServerClient();
  const supabaseSerice = createSupabaseService();

  try {
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    const { data: authorizationData } = await supabaseAuth.from('users').select('admins(userId), managers(userId)');
    const isAuthorized =
      authorizationData && (authorizationData[0].admins.length > 0 || authorizationData[0].managers.length > 0);

    const userData: UserAuthType & UpdateUserPersonalInformationType = await request.json();
    const { email, password, ...userDataToUpdate } = userData;

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

    const { data: createdUserData, error: createUserError } = await supabaseSerice.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      return NextResponse.json({ success: false, message: `Failed to create user. ${createUserError.message}.` });
    }

    const { error: updateUserError } = await supabaseSerice
      .from('users')
      .update(userDataToUpdate)
      .eq('userId', createdUserData.user.id);

    if (updateUserError) {
      return NextResponse.json({
        success: false,
        message: `Auth user created successfully, but failed to update users table. ${updateUserError.message}.`,
      });
    }

    if (userDataToUpdate.role && userDataToUpdate.role === 'admin') {
      // role column in users table updated automatically by update_user_role_admins_trigger
      const { error: userAdminRoleError } = await supabaseSerice
        .from('admins')
        .insert({ userId: createdUserData.user.id });

      if (userAdminRoleError) {
        return NextResponse.json({
          success: false,
          message: `User created successfully, but failed to set role. ${userAdminRoleError.message}.`,
        });
      }
    }

    if (userDataToUpdate.role && userDataToUpdate.role === 'manager') {
      // role column in users table updated automatically by update_user_role_managers_trigger
      const { error: userAdminRoleError } = await supabaseSerice
        .from('managers')
        .insert({ userId: createdUserData.user.id });

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
