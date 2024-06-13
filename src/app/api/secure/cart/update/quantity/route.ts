import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateCartItemQuantity, UpdateCartItemQuantitySchema } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update cart item quantity');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.AUTHENTICATION,
        },

        { status: 401 }
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

    let cartItemData: UpdateCartItemQuantity;

    try {
      cartItemData = await request.json();
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

    const validation = UpdateCartItemQuantitySchema.safeParse(cartItemData);

    if (!validation.success) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { payload: cartItemData, error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },

        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('cart')
      .update({ quantity: validation.data.quantity })
      .eq('cartItemId', validation.data.cartItemId);

    if (updateError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update quantity. Please try again later.',
        },

        { status: 500 }
      );
    }

    const successMessage = 'Updated quantity successfully';

    log.info(successMessage, { payload: cartItemData });

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
