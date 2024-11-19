import { NextResponse } from 'next/server';
import { ResponseWithNoData, StringIdSchema } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';

import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

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
      log.error(LOGGER_ERROR_MESSAGES.authentication, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.authentication,
        },
        { status: 500 }
      );
    }

    if (!authUser) {
      log.warn(LOGGER_ERROR_MESSAGES.notAuthenticated, { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthenticated,
        },
        { status: 401 }
      );
    }

    log = request.log.with({ userId: authUser.id });

    const isAuthorized = await checkAuthorizationServer(supabase, 'users.delete');

    if (!isAuthorized) {
      const userRole = await getUserRoleFromSession(supabase);
      log.warn(LOGGER_ERROR_MESSAGES.notAuthorized, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthorized,
        },
        { status: 401 }
      );
    }

    let userIdsArray: string[];

    try {
      userIdsArray = await request.json();
    } catch (error) {
      log.error(LOGGER_ERROR_MESSAGES.parse, { error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const validation = StringIdSchema.array().safeParse(userIdsArray);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
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
          message: `Failed to delete ${numberOfPromiseRejections} user(s). ${deleteUserRejections[0].message}.`,
        },
        { status: 500 }
      );
    }

    if (numberOfDeleteErrors > 0) {
      log.error(LOGGER_ERROR_MESSAGES.databaseDelete, { errors: deleteUserErrors });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete ${numberOfDeleteErrors} user(s). ${deleteUserErrors[0].message}.`,
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
    log.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return NextResponse.json(
      {
        success: false,
        message: USER_ERROR_MESSAGES.unexpected,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
