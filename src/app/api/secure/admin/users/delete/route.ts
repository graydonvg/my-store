import { NextResponse } from 'next/server';
import { ResponseWithNoData, StringIdSchema } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { CONSTANTS } from '@/constants';

export const DELETE = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const supabaseSerice = createSupabaseService();
  let log = request.log;

  log.info('Attempting to delete user(s)');

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

    const userRole = await getUserRoleFromSession(supabase);
    const { isManager, isOwner } = getUserRoleBoolean(userRole);

    if (!isManager && !isOwner) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },
        { status: 401 }
      );
    }

    let userIdsArray: string[];

    try {
      userIdsArray = await request.json();
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

    const validation = StringIdSchema.array().safeParse(userIdsArray);

    if (!validation.success) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },
        { status: 400 }
      );
    }

    const deleteUserPromises = validation.data.map((userId) => supabaseSerice.auth.admin.deleteUser(userId));

    const deleteUserPromiseResults = await Promise.allSettled(deleteUserPromises);

    const deleteUserRejections = deleteUserPromiseResults.reduce((acc: Error[], result) => {
      if (result.status === 'rejected' && result.reason) {
        acc.push(result.reason);
      }
      return acc;
    }, []);

    const deleteUserErrors = deleteUserPromiseResults.reduce((acc: Error[], result) => {
      if (result.status === 'fulfilled' && result.value.error) {
        acc.push(result.value.error);
      }
      return acc;
    }, []);

    const numberOfPromiseRejections = deleteUserRejections.length;
    const numberOfDeleteErrors = deleteUserErrors.length;

    if (numberOfPromiseRejections > 0) {
      log.error('Promise rejected', { rejections: deleteUserRejections });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete ${numberOfPromiseRejections} user(s). Please try again later.`,
        },
        { status: 500 }
      );
    }

    if (numberOfDeleteErrors > 0) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_DELETE, { errors: deleteUserErrors });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete ${numberOfDeleteErrors} user(s). Please try again later.`,
        },
        { status: 500 }
      );
    }

    const successMessage = `User(s) deleted successfully`;

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 200 }
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
