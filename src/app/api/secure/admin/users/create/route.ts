import { NextResponse } from 'next/server';
import { UpdateUserDb, AdminAddNewUserResponse, CustomResponse, UserAuthData } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyFormFields } from '@/utils/getEmptyFormFields';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import getUserRoleFromSession from '@/utils/getUserRoleFromSession';
import getUserRoleBoolean from '@/utils/getUserRoleBoolean';
import { withAxiom, AxiomRequest } from 'next-axiom';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse<AdminAddNewUserResponse>>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userRole = await getUserRoleFromSession(supabase);
    const userData: UserAuthData & UpdateUserDb = await request.json();
    const supabaseService = createSupabaseService();

    const { email, password, ...userDataToUpdate } = userData;
    const { role, ...restOfDataToUpdate } = userDataToUpdate;
    const emptyFieldsArray = getEmptyFormFields(restOfDataToUpdate);
    const numberOfFormFields = getNumberOfFormFields(restOfDataToUpdate);
    const hasDataToUpdate = emptyFieldsArray.length !== numberOfFormFields;
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(userRole);
    const failedMessage = 'Failed to create user';
    const successMessage = 'User created successfully.';

    request.log.info('Attempt: Create user.', {
      callerId: authUser?.id,
      callerRole: userRole,
      callerEmail: authUser?.email,
      partialPayload: { email, ...userDataToUpdate },
    });

    if (!authUser) {
      const message = `${failedMessage}. Not authenticated.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!isAdmin && !isManager && !isOwner) {
      const message = `${failedMessage}. Not authorized.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!userData) {
      const message = `${failedMessage}. No data received.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (
      (role === 'owner' && !isOwner) ||
      (role === 'manager' && !isOwner) ||
      (role === 'admin' && !(isOwner || isManager))
    ) {
      const message = `${failedMessage}. Not authorized to assign role '${role}'.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    const { data: createUserData, error: createUserError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      const message = `${failedMessage}. Database error.`;

      request.log.error(message, createUserError);

      return NextResponse.json({
        success: false,
        message: `${message} ${createUserError.message}.`,
      });
    }

    if (hasDataToUpdate) {
      // Using supabaseService since anyone can sign up
      const { error: updateUserError } = await supabaseService
        .from('users')
        .update(restOfDataToUpdate)
        .eq('userId', createUserData.user.id);

      if (updateUserError) {
        const message = 'Auth user created successfully, but failed to update users table entry.';

        request.log.error(message, updateUserError);

        return NextResponse.json({
          success: false,
          message: `${message} ${updateUserError.message}.`,
        });
      }

      if (role) {
        // Not using supabaseService since not everyone can assign roles
        const { error: insertUserRoleError } = await supabase
          .from('userRoles')
          .insert({ userId: createUserData.user.id, role });

        if (insertUserRoleError) {
          const message = 'User created successfully, but failed to assign user role.';

          request.log.error(message, insertUserRoleError);

          return NextResponse.json({
            success: false,
            message: `${message} ${insertUserRoleError.message}.`,
          });
        }
      }
    }

    request.log.info(successMessage);

    return NextResponse.json({ success: true, message: successMessage });
  } catch (error) {
    const failedMessage = 'Failed to create user';

    request.log.error(`${failedMessage}.`, { error: error as Error });

    return NextResponse.json({ success: false, message: `${failedMessage}. An unexpected error occurred.` });
  }
}

export const POST = withAxiom(handlePost);
