import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateCartItemSize, UpdateCartItemSizeSchema } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update cart item size');

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

    let cartItemData: UpdateCartItemSize;

    try {
      cartItemData = await request.json();
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

    const validation = UpdateCartItemSizeSchema.safeParse(cartItemData);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { payload: cartItemData, error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('cart')
      .update({ size: validation.data.size })
      .eq('cartItemId', validation.data.cartItemId);

    if (updateError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update size. Please try again later.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Updated size successfully';

    log.info(successMessage, { payload: cartItemData });

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
