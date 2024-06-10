import { NextResponse } from 'next/server';
import { ResponseWithNoData, InsertCartItemDb } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { insertCartItemSchema } from '@/schemas/insertCartItemSchema';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const log = request.log;

  log.info('Attempting to add item to cart');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED, { authError, user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
        },

        { status: 401 }
      );
    }

    let cartItem: InsertCartItemDb;

    try {
      cartItem = await request.json();
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NO_DATA_RECEIVED,
        },
        { status: 400 }
      );
    }

    try {
      insertCartItemSchema.parse(cartItem);
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error, cartItem });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },

        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from('cart').insert(cartItem);

    if (insertError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add item to cart. Please try again later.',
        },

        { status: 500 }
      );
    }

    log.info('Item added to cart successfully', { cartItem, userId: authUser.id });

    return NextResponse.json(
      {
        success: true,
        message: 'Item added to cart successfully',
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
