import { NextResponse } from 'next/server';
import { ResponseWithNoData, UserAuthData, UserAuthDataSchema } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/construct';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const log = request.log;
  const successMessage = 'Sign in successful';

  log.info('Attempting to sign in user');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      log.warn('A user session already exists', { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to sign in. Please try again later.',
        },
        { status: 409 }
      );
    }

    let signInData: UserAuthData;

    try {
      signInData = await request.json();
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NO_DATA,
        },
        { status: 400 }
      );
    }

    const validation = UserAuthDataSchema.safeParse(signInData);

    if (!validation.success) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword(validation.data);

    if (signInError) {
      log.error('Sign in error', { error: signInError });

      return NextResponse.json(
        {
          success: false,
          message: `Sign in failed. ${signInError.message}.`,
        },
        { status: 500 }
      );
    }

    log.info(successMessage, { userId: data.user.id });

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
