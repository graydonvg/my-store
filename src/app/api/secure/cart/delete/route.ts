import { NextResponse } from 'next/server';
import { NumericIdSchema, ResponseWithNoData } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const DELETE = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to delete cart item');

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

    const searchParams = request.nextUrl.searchParams;
    const cartItemId = searchParams.get('cart_item_id');

    if (!cartItemId) {
      log.error(LOGGER_ERROR_MESSAGES.noData);

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const validation = NumericIdSchema.safeParse(cartItemId);

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

    const { error: deleteError } = await supabase.from('cart').delete().eq('cartItemId', validation.data);

    if (deleteError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseDelete, { error: deleteError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to remove item from cart. Please try again later.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Item remove from cart successfully';

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
