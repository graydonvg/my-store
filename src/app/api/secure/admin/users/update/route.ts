import { NextResponse } from 'next/server';
import { AdminUpdateUserDb, CustomResponse } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import getUserRoleFromSession from '@/utils/getUserRoleFromSession';
import getUserRoleBoolean from '@/utils/getUserRoleBoolean';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userRole = await getUserRoleFromSession(supabase);
    const userData: AdminUpdateUserDb = await request.json();

    const { userId, ...userDataToUpdate } = userData;
    const { role, ...restOfDataToUpdate } = userDataToUpdate;
    const numberOfFormFields = getNumberOfFormFields(restOfDataToUpdate);
    const hasDataToUpdate = numberOfFormFields > 0;
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(userRole);
    const failedMessage = 'Failed to update user';
    const successMessage = 'User updated successfully.';

    request.log.info('Attempt: Update user.', {
      callerId: authUser?.id,
      callerRole: userRole,
      callerEmail: authUser?.email,
      payload: userData,
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

    if (!userData || !(hasDataToUpdate || role)) {
      const message = `${failedMessage}. No data received.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!userId) {
      const message = `${failedMessage}. Please provide a valid user ID.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (hasDataToUpdate) {
      const { error: updateUserError } = await supabase.from('users').update(restOfDataToUpdate).eq('userId', userId);

      if (updateUserError) {
        const message = `${failedMessage}. Database error.`;

        request.log.error(message, updateUserError);

        return NextResponse.json({
          success: false,
          message: `${message} ${updateUserError.message}.`,
        });
      }
    }

    if (role) {
      if (!role.old || !role.new) {
        const message = `${failedMessage}. Old and new roles required.`;

        request.log.error(message);

        return NextResponse.json({
          success: false,
          message,
        });
      }

      if (
        (role.new === 'owner' && !isOwner) ||
        (role.new === 'manager' && !isOwner) ||
        (role.new === 'admin' && !(isOwner || isManager))
      ) {
        const message = `${failedMessage}. Not authorized to assign role '${role}'.`;

        request.log.error(message);

        return NextResponse.json({
          success: false,
          message,
        });
      }

      if (role.new === 'none') {
        const { error: deleteUserRoleError } = await supabase.from('userRoles').delete().eq('userId', userId);

        if (deleteUserRoleError) {
          const message = 'Failed to update user role. Database error.';

          request.log.error(message, deleteUserRoleError);

          return NextResponse.json({
            success: false,
            message: `${message} ${deleteUserRoleError.message}.`,
          });
        }
      } else if (role.old === 'none') {
        const { error: insertUserRoleError } = await supabase
          .from('userRoles')
          .insert({ userId, role: role.new })
          .eq('userId', userId);

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
          .update({ userId, role: role.new })
          .eq('userId', userId);

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
