import { NextResponse } from 'next/server';

import {
  ResponseWithNoData,
  UserPersonalInfo,
  UserPersonalInfoSchema,
  UserAuthData,
  UserAuthDataSchema,
} from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyObjectKeys } from '@/utils/checkObject';
import { getObjectKeyCount } from '@/utils/checkObject';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/construct';

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
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },
        { status: 400 }
      );
    }

    const { email, password, ...userDataToUpdate } = signUpData;

    const userAuthValidation = UserAuthDataSchema.safeParse({ email, password });

    if (!userAuthValidation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: userAuthValidation.error });

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

    const emptyFormFields = getEmptyObjectKeys(userDataValidation.data);
    const numberOfFromFields = getObjectKeyCount(userDataValidation.data);
    const hasDataToUpdate = emptyFormFields.length !== numberOfFromFields;

    if (hasDataToUpdate) {
      const userId = signUpResponse?.user?.id ?? '';

      const { error: updateUserError } = await supabase
        .from('users')
        .update(userDataValidation.data)
        .eq('userId', userId);

      if (updateUserError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateUserError });

        return NextResponse.json(
          {
            success: false,
            message: 'Sign up successful, but failed to insert name and/or contact number.',
          },
          { status: 500 }
        );
      }
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
