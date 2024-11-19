import { NextResponse } from 'next/server';
import { UpdateUserAdmin, ResponseWithNoData, UpdateUserAdminSchema } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { CONSTANTS } from '@/constants';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update user');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.AUTHENTICATION,
        },
        { status: 500 }
      );
    }

    if (!authUser) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED, { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
        },
        { status: 401 }
      );
    }

    log = request.log.with({ userId: authUser.id });

    const isAuthorized = await checkAuthorizationServer(supabase, 'users.update');
    const userRole = await getUserRoleFromSession(supabase);

    if (!isAuthorized) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },
        { status: 401 }
      );
    }

    let userData: UpdateUserAdmin;

    try {
      userData = await request.json();
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },
        { status: 400 }
      );
    }

    const userDataValidation = UpdateUserAdminSchema.safeParse(userData);

    if (!userDataValidation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: userDataValidation.error });

      const errorMessage = constructZodErrorMessage(userDataValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { userId: userToUpdateId, currentRole: userToUpdateCurrentRole, dataToUpdate } = userDataValidation.data;
    const { role: roleToAssign, ...userDataToUpdate } = dataToUpdate;

    const { isManager, isOwner } = getUserRoleBoolean(userRole);

    if (
      (userToUpdateCurrentRole === 'owner' && !isOwner) ||
      (userToUpdateCurrentRole === 'manager' && !isOwner) ||
      (userToUpdateCurrentRole === 'admin' && !(isOwner || isManager))
    ) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole, userToUpdateCurrentRole });

      return NextResponse.json(
        {
          success: false,
          message: `Not authorized to update ${userToUpdateCurrentRole} account.`,
        },
        { status: 401 }
      );
    }

    let isAuthorizedToAssignRoles = false;

    if (roleToAssign) {
      isAuthorizedToAssignRoles = await checkAuthorizationServer(supabase, 'userRoles.update');
    }

    if (
      roleToAssign &&
      roleToAssign !== 'none' &&
      (!isAuthorizedToAssignRoles ||
        (roleToAssign === 'owner' && !isOwner) ||
        (roleToAssign === 'manager' && !isOwner) ||
        (roleToAssign === 'admin' && !(isOwner || isManager)))
    ) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole, roleToAssign });

      return NextResponse.json(
        {
          success: false,
          message: `Not authorized to assign role '${roleToAssign}'.`,
        },
        { status: 401 }
      );
    }

    const userDataObjectKeyCount = getObjectKeyCount(userDataToUpdate);
    const hasUserDataToUpdate = userDataObjectKeyCount > 0;

    if (hasUserDataToUpdate) {
      const { error: updateError } = await supabase.from('users').update(userDataToUpdate).eq('userId', userToUpdateId);

      if (updateError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateError });

        return NextResponse.json(
          {
            success: false,
            message: `Failed to update user. ${updateError.message}.`,
          },
          { status: 500 }
        );
      }
    }

    if (roleToAssign) {
      if (roleToAssign === 'none') {
        const { error: deleteError } = await supabase.from('userRoles').delete().eq('userId', userToUpdateId);

        if (deleteError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_DELETE, { error: deleteError });

          return NextResponse.json(
            {
              success: false,
              message: `Failed to update user role. ${deleteError.message}`,
            },
            { status: 500 }
          );
        }
      } else if (userToUpdateCurrentRole === 'none') {
        const { error: insertError } = await supabase
          .from('userRoles')
          .insert({ userId: userToUpdateId, role: roleToAssign })
          .eq('userId', userToUpdateId);

        if (insertError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertError });

          return NextResponse.json(
            {
              success: false,
              message: `Failed to update user role. ${insertError.message}`,
            },
            { status: 500 }
          );
        }
      } else {
        const { error: updateError } = await supabase
          .from('userRoles')
          .update({ role: roleToAssign })
          .eq('userId', userToUpdateId);

        if (updateError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateError });

          return NextResponse.json(
            {
              success: false,
              message: `Failed to update user role. ${updateError.message}`,
            },
            { status: 500 }
          );
        }
      }
    }

    const successMessage = 'User updated successfully';

    log.info(successMessage, { payload: userData });

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return NextResponse.json(
      {
        success: false,
        message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
