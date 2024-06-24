import { CustomResponse, StripeCheckoutData, StripeCheckoutDataSchema, StripeCheckoutSessionResponse } from '@/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = withAxiom(
  async (request: AxiomRequest): Promise<NextResponse<CustomResponse<StripeCheckoutSessionResponse | null>>> => {
    const supabase = await createSupabaseServerClient();
    let log = request.log;

    log.info('Attempting to create Stripe checkout session');

    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.AUTHENTICATION,
            data: null,
          },
          { status: 500 }
        );
      }

      if (!authUser) {
        log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED, { user: authUser });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
            data: null,
          },
          { status: 401 }
        );
      }

      log = request.log.with({ userId: authUser.id });

      let checkoutData: StripeCheckoutData;

      try {
        checkoutData = await request.json();
      } catch (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
            data: null,
          },
          { status: 400 }
        );
      }

      const validation = StripeCheckoutDataSchema.safeParse(checkoutData);

      if (!validation.success) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { payload: checkoutData, error: validation.error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
            data: null,
          },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: validation.data.lineItems,
        mode: 'payment',
        success_url: `${CONSTANTS.URL}/checkout/payment/confirmation?payment_status=success&order_id=${validation.data.orderId}`,
        cancel_url: `${CONSTANTS.URL}/cart/view?payment_status=cancelled&order_id=${validation.data.orderId}`,
        metadata: { userId: authUser.id, orderId: validation.data.orderId },
        payment_intent_data: {
          metadata: { userId: authUser.id, orderId: validation.data.orderId },
        },
      });

      const { error: insertError } = await supabase
        .from('pendingCheckoutSessions')
        .insert({ sessionId: session.id, userId: authUser.id, orderId: validation.data.orderId });

      if (insertError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertError });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to insert checkout session ID. Please try again later.',
            data: null,
          },
          { status: 500 }
        );
      }

      const successMessage = 'Stripe checkout session created successfully';

      log.info(successMessage, { checkoutData });

      return NextResponse.json(
        {
          success: true,
          message: successMessage,
          data: { sessionId: session.id },
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
          data: null,
        },
        { status: 500 }
      );
    } finally {
      await log.flush();
    }
  }
);
