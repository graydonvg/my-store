import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdatePassword, UpdatePasswordSchema } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update user password');

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

    let passwordData: UpdatePassword;

    try {
      passwordData = await request.json();
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

    const validation = UpdatePasswordSchema.safeParse(passwordData);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      const message = 'New password and confirmation password do not match';

      log.warn(message);

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 }
      );
    }

    const { data: passwordVerificationSuccess } = await supabase.rpc('verifyUserPassword', {
      password: passwordData.currentPassword,
    });

    if (!passwordVerificationSuccess) {
      const message = 'Incorrect current password';

      log.warn(message);

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: passwordData.newPassword });

    if (updateError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update password. Please try again later.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Password updated successfully';

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 201 }
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
