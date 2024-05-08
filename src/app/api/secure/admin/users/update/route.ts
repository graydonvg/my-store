import { NextResponse } from 'next/server';
import { CustomResponse, UpdateUserDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import getUserRoleFromSession from '@/utils/getUserRoleFromSession';
import getUserRoleBoolean from '@/utils/getUserRoleBoolean';
import { withAxiom, AxiomRequest } from 'next-axiom';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userRole = await getUserRoleFromSession(supabase);
    const userData: UpdateUserDb = await request.json();

    const { userId, ...userDataToUpdate } = userData;
    const { role, ...restOfDataToUpdate } = userDataToUpdate;
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

    if (!userData) {
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

    const { error: updateUserError } = await supabase.from('users').update(restOfDataToUpdate).eq('userId', userId);

    if (updateUserError) {
      const message = `${failedMessage}. Database error.`;

      request.log.error(message, updateUserError);

      return NextResponse.json({
        success: false,
        message: `${message} ${updateUserError.message}.`,
      });
    }

    if (role) {
      const { error: updateUserRoleError } = await supabase.from('userRoles').update({ userId, role });

      if (updateUserRoleError) {
        const message = 'Failed to update user role. Database error.';

        request.log.error(message, updateUserRoleError);

        return NextResponse.json({
          success: false,
          message: `${message} ${updateUserRoleError.message}.`,
        });
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
