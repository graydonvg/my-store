import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateAddress, UpdateAddressSchema } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update address');

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

    let addressData: UpdateAddress;

    try {
      addressData = await request.json();
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

    const validation = UpdateAddressSchema.safeParse(addressData);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { payload: addressData, error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('addresses')
      .update(validation.data)
      .eq('addressId', validation.data.addressId);

    if (updateError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update address. Please try again later.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Address updated successfully';

    log.info(successMessage, { payload: addressData });

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
