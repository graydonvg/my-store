import { NextResponse } from 'next/server';
import { CustomResponse } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const userRole = await getUserRoleFromSession(supabase);
    const usersToDelete: string[] = await request.json();
    const supabaseSerice = createSupabaseService();

    const usersToDeleteLength = usersToDelete.length;
    const { isManager, isOwner } = getUserRoleBoolean(userRole);

    const failedMessage = `Failed to delete user${usersToDeleteLength > 1 ? 's' : ''}`;
    const successMessage = `User${usersToDeleteLength > 1 ? 's' : ''} deleted successfully.`;

    request.log.info(`Attempt: Delete user${usersToDeleteLength > 1 ? 's' : ''}.`, {
      callerId: authUser?.id,
      callerRole: userRole,
      callerEmail: authUser?.email,
      payload: usersToDelete,
    });

    if (!authUser) {
      const message = `${failedMessage}. Not authenticated.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!isManager && !isOwner) {
      const message = `${failedMessage}. Not authorized.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (usersToDeleteLength === 0) {
      const message = `${failedMessage}. No data received.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    const deleteUserPromises = usersToDelete.map((userId) => supabaseSerice.auth.admin.deleteUser(userId));

    const deleteUserPromiseResults = await Promise.allSettled(deleteUserPromises);

    const deleteUserRejections = deleteUserPromiseResults.reduce((acc: Error[], result) => {
      if (result.status === 'rejected' && result.reason) {
        acc.push(result.reason);

        request.log.error('User deletion failed:', result.reason);
      }
      return acc;
    }, []);

    const deleteUserRejectionsLength = deleteUserRejections.length;

    if (deleteUserRejectionsLength > 0) {
      const failureRatio = `${deleteUserRejectionsLength} / ${usersToDeleteLength}`;

      return NextResponse.json({
        success: false,
        message: `Failed to delete ${failureRatio} users. Database error. Please try again later.`,
      });
    }

    request.log.info(successMessage);

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    const failedMessage = 'Failed to delete user(s). An unexpect error occured.';

    request.log.error(`${failedMessage}.`, { error: error as Error });

    return NextResponse.json({ success: false, message: failedMessage });
  }
}

export const POST = withAxiom(handlePost);
