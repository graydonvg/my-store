import { NextResponse } from 'next/server';
import { ResponseNoData, InsertCartItemDb } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { validateCartItem } from '@/utils/validate';
import { z } from 'zod';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseNoData[]>> => {
  const supabase = await createSupabaseServerClient();
  const log = request.log;

  log.info('Attempting to add item to cart');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { authError, user: authUser });

      return NextResponse.json(
        [
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
          },
        ],
        { status: 401 }
      );
    }

    let cartItem: InsertCartItemDb;

    try {
      cartItem = await request.json();
    } catch (parseError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error: parseError });

      return NextResponse.json(
        [
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.NO_DATA_RECEIVED,
          },
        ],
        { status: 400 }
      );
    }

    try {
      validateCartItem(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: error.issues, cartItem });

        const response = error.issues.map((issue) => ({
          success: false,
          message: issue.message,
        }));

        return NextResponse.json(response, { status: 400 });
      }
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: error, cartItem });

      return NextResponse.json(
        [
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_VALIDATION_ERROR,
          },
        ],
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from('cart').insert(cartItem);

    if (insertError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertError });

      return NextResponse.json(
        [
          {
            success: false,
            message: 'Failed to add item to cart. Please try again later.',
          },
        ],
        { status: 500 }
      );
    }

    log.info('Item added to cart successfully', { cartItem, userId: authUser.id });

    return NextResponse.json(
      [
        {
          success: true,
          message: 'Item added to cart successfully',
        },
      ],
      { status: 201 }
    );
  } catch (error) {
    log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL_ERROR, { error });

    return NextResponse.json(
      [
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_ERROR,
        },
      ],
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
