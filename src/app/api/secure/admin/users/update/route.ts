import { NextResponse } from 'next/server';
import { UpdateUserAdminDb, CustomResponse } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const callerRole = await getUserRoleFromSession(supabase);
    const userToUpdateData: UpdateUserAdminDb = await request.json();

    const { userId: userToUpdateId, currentRole: userToUpdateCurrentRole, dataToUpdate } = userToUpdateData;
    const { role: newRole, ...personalDataToUpdate } = dataToUpdate;

    const numberOfFormFields = getNumberOfFormFields(personalDataToUpdate);
    const hasPersonalDataToUpdate = numberOfFormFields > 0;
    const {
      isAdmin: callerIsAdmin,
      isManager: callerIsManager,
      isOwner: callerIsOwner,
    } = getUserRoleBoolean(callerRole);

    const failedMessage = 'Failed to update user';
    const successMessage = 'User updated successfully.';

    request.log.info('Attempt: Update user.', {
      callerId: authUser?.id,
      callerRole,
      callerEmail: authUser?.email,
      payload: userToUpdateData,
    });

    if (!authUser) {
      const message = `${failedMessage}. Not authenticated.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!callerIsAdmin && !callerIsManager && !callerIsOwner) {
      const message = `${failedMessage}. Not authorized.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!userToUpdateData || !(hasPersonalDataToUpdate || newRole)) {
      const message = `${failedMessage}. No data received.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!userToUpdateId) {
      const message = `${failedMessage}. Please provide a valid user ID.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (
      (userToUpdateCurrentRole === 'owner' && !callerIsOwner) ||
      (userToUpdateCurrentRole === 'manager' && !callerIsOwner) ||
      (userToUpdateCurrentRole === 'admin' && !(callerIsOwner || callerIsManager))
    ) {
      const message = `${failedMessage}. Not authorized to update '${userToUpdateCurrentRole}'.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (hasPersonalDataToUpdate) {
      const { error: updateUserError } = await supabase
        .from('users')
        .update(personalDataToUpdate)
        .eq('userId', userToUpdateId);

      if (updateUserError) {
        const message = `${failedMessage}. Database error.`;

        request.log.error(message, updateUserError);

        return NextResponse.json({
          success: false,
          message: `${message} ${updateUserError.message}.`,
        });
      }
    }

    if (newRole) {
      if (
        (newRole === 'owner' && !callerIsOwner) ||
        (newRole === 'manager' && !callerIsOwner) ||
        (newRole === 'admin' && !(callerIsOwner || callerIsManager))
      ) {
        const message = `${failedMessage}. Not authorized to assign role '${newRole}'.`;

        request.log.error(message);

        return NextResponse.json({
          success: false,
          message,
        });
      }

      if (newRole === 'none') {
        const { error: deleteUserRoleError } = await supabase.from('userRoles').delete().eq('userId', userToUpdateId);

        if (deleteUserRoleError) {
          const message = 'Failed to update user role. Database error.';

          request.log.error(message, deleteUserRoleError);

          return NextResponse.json({
            success: false,
            message: `${message} ${deleteUserRoleError.message}.`,
          });
        }
      } else if (userToUpdateCurrentRole === 'none') {
        const { error: insertUserRoleError } = await supabase
          .from('userRoles')
          .insert({ userId: userToUpdateId, role: newRole })
          .eq('userId', userToUpdateId);

        if (insertUserRoleError) {
          const message = 'Failed to update user role. Database error.';

          request.log.error(message, insertUserRoleError);

          return NextResponse.json({
            success: false,
            message: `${message} ${insertUserRoleError.message}.`,
          });
        }
      } else {
        const { error: updateUserRoleError } = await supabase
          .from('userRoles')
          .update({ role: newRole })
          .eq('userId', userToUpdateId);

        if (updateUserRoleError) {
          const message = 'Failed to update user role. Database error.';

          request.log.error(message, updateUserRoleError);

          return NextResponse.json({
            success: false,
            message: `${message} ${updateUserRoleError.message}.`,
          });
        }
      }
    }

    request.log.info(successMessage);

    return NextResponse.json({ success: true, message: successMessage });
  } catch (error) {
    const failedMessage = 'Failed to update user';

    request.log.error(`${failedMessage}.`, { error: error as Error });

    return NextResponse.json({ success: false, message: `${failedMessage}. An unexpected error occurred.` });
  }
}

export const POST = withAxiom(handlePost);
