import { NextResponse } from 'next/server';
import { InsertCartItemDb } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { validateCartItem } from '@/utils/validate';

export const POST = withAxiom(async (request: AxiomRequest) => {
  const supabase = await createSupabaseServerClient();
  const log = request.log.with({ scope: 'api', endpoint: '/api/secure/cart/add', method: 'POST' });

  log.info('Function called');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      log.warn('Authentication error or user not authenticated', { authError, user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.ERROR_MESSAGES.NOT_AUTHENTICATED,
        },
        { status: 401 }
      );
    }

    let cartItem: InsertCartItemDb;

    try {
      cartItem = await request.json();
    } catch (parseError) {
      log.error('Error parsing JSON', { error: parseError });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.ERROR_MESSAGES.NO_DATA_RECEIVED,
        },
        { status: 400 }
      );
    }

    const validation = validateCartItem(cartItem);

    if (!validation.success) {
      log.warn('Validation error', { error: validation.message, cartItem });

      return NextResponse.json(
        {
          success: false,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from('cart').insert(cartItem);

    if (insertError) {
      log.error('Database insert error', { error: insertError });

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
    log.error('Unexpected error', { error });

    return NextResponse.json(
      {
        success: false,
        message: CONSTANTS.ERROR_MESSAGES.GENERAL_ERROR,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
