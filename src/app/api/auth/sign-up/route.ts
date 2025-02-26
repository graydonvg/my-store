import { NextResponse } from 'next/server';
import {
  ResponseWithNoData,
  UserPersonalInfo,
  UserPersonalInfoSchema,
  UserAuthData,
  UserAuthDataSchema,
} from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const log = request.log;

  log.info('Attempting to sign up user');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      log.warn('A user session already exists', { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to sign up. Please try again later.',
        },
        { status: 409 }
      );
    }

    let signUpData: UserAuthData & UserPersonalInfo;

    try {
      signUpData = await request.json();
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

    const { email, password, ...userDataToUpdate } = signUpData;

    const userAuthValidation = UserAuthDataSchema.safeParse({ email, password });

    if (!userAuthValidation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { error: userAuthValidation.error });

      const errorMessage = constructZodErrorMessage(userAuthValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const userDataValidation = UserPersonalInfoSchema.safeParse(userDataToUpdate);

    if (!userDataValidation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { error: userDataValidation.error });

      const errorMessage = constructZodErrorMessage(userDataValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { data: signUpResponse, error: signUpError } = await supabase.auth.signUp(userAuthValidation.data);

    if (signUpError) {
      log.error('Sign up error', { error: signUpError });

      return NextResponse.json(
        {
          success: false,
          message: `Sign up failed. ${signUpError.message}.`,
        },
        { status: 500 }
      );
    }

    const userId = signUpResponse?.user?.id ?? '';

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ ...userDataValidation.data, createdBy: userId })
      .eq('userId', userId);

    if (updateUserError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateUserError });

      return NextResponse.json(
        {
          success: false,
          message: 'Sign up successful, but failed to insert name and/or contact number.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Sign up successful';

    log.info(successMessage, { userId: signUpResponse.user?.id });

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
