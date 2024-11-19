import { NextResponse } from 'next/server';
import { ResponseWithNoData, InsertCartItem, InsertCartItemSchema } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to add item to cart');

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

    let cartItem: InsertCartItem;

    try {
      cartItem = await request.json();
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

    const validation = InsertCartItemSchema.safeParse(cartItem);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { payload: cartItem, error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from('cart').insert(validation.data);

    if (insertError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseInsert, { error: insertError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add item to cart. Please try again later.',
        },
        { status: 500 }
      );
    }

    const successMessage = 'Item added to cart successfully';

    log.info(successMessage, { payload: cartItem });

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
