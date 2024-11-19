import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import createSupabaseService from '@/lib/supabase/supabase-service';
import { ResponseWithNoData } from '@/types';
import { USER_ERROR_MESSAGES } from '@/constants';

const supabase = createSupabaseService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

async function handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  try {
    const checkoutSession = event.data.object;
    const orderId = checkoutSession.metadata!.orderId;
    const userId = checkoutSession.metadata!.userId;

    const { error: updateOrderStatusError } = await supabase
      .from('orders')
      .update({ orderStatus: 'paid' })
      .eq('orderId', orderId)
      .eq('userId', userId);

    if (updateOrderStatusError) {
      return {
        success: false,
        message: `Failed to update order status. ${updateOrderStatusError.message}.`,
      };
    }

    const { error: deletePendingCheckoutSessionError } = await supabase
      .from('pendingCheckoutSessions')
      .delete()
      .eq('orderId', orderId)
      .eq('userId', userId);

    if (deletePendingCheckoutSessionError) {
      return {
        success: false,
        message: `Failed to delete pending checkout session. ${deletePendingCheckoutSessionError.message}.`,
      };
    }

    const { error: deleteCartErrorCompleted } = await supabase.from('cart').delete().eq('userId', userId);

    if (deleteCartErrorCompleted) {
      return {
        success: false,
        message: `Failed to clear cart. ${deleteCartErrorCompleted.message}.`,
      };
    }

    return { success: true, message: 'Completed checkout session handled successfully' };
  } catch (error) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, message: `Error handling completed checkout session: ${message}` };
  }
}

async function handleCheckoutSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
  try {
    const checkoutSession = event.data.object;
    const orderId = checkoutSession.metadata!.orderId;
    const userId = checkoutSession.metadata!.userId;

    const { error: deletePendingCheckoutSessionError } = await supabase
      .from('pendingCheckoutSessions')
      .delete()
      .eq('orderId', orderId)
      .eq('userId', userId);

    if (deletePendingCheckoutSessionError) {
      return {
        success: false,
        message: `Failed to delete expired checkout session. ${deletePendingCheckoutSessionError.message}.`,
      };
    }

    return { success: true, message: 'Expired checkout session handled successfully' };
  } catch (error) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, message: `Error handling expired checkout session: ${message}` };
  }
}

async function handleChargeRefunded(event: Stripe.ChargeRefundedEvent) {
  try {
    const refund = event.data.object;
    const orderId = refund.metadata.orderId;
    const userId = refund.metadata.userId;

    const { error: updateOrderStatusError } = await supabase
      .from('orders')
      .update({ orderStatus: 'refunded' })
      .eq('orderId', orderId)
      .eq('userId', userId);

    if (updateOrderStatusError) {
      return {
        success: false,
        message: `Failed to update order status. ${updateOrderStatusError.message}.`,
      };
    }

    return { success: true, message: 'Charge refund handled successfully' };
  } catch (error) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, message: `Error handling charge refund: ${message}` };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ResponseWithNoData>> {
  try {
    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json(
        {
          success: false,
          message: 'Received empty request body',
        },
        { status: 400 }
      );
    }

    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing Stripe signature',
        },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      }

      return NextResponse.json(
        {
          success: false,
          message: `Webhook signature verification failed: ${message}`,
        },
        { status: 500 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const { success, message } = await handleCheckoutSessionCompleted(event);

        if (!success) {
          return NextResponse.json(
            {
              success: false,
              message,
            },
            { status: 500 }
          );
        }
        break;
      }

      case 'checkout.session.expired': {
        const { success, message } = await handleCheckoutSessionExpired(event);

        if (!success) {
          return NextResponse.json(
            {
              success: false,
              message,
            },
            { status: 500 }
          );
        }
        break;
      }

      case 'charge.refunded': {
        const { success, message } = await handleChargeRefunded(event);

        if (!success) {
          return NextResponse.json(
            {
              success: false,
              message,
            },
            { status: 500 }
          );
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook called successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: USER_ERROR_MESSAGES.unexpected,
      },
      { status: 500 }
    );
  }
}
