import { CustomResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import createSupabaseService from '@/lib/supabase/supabase-service';

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
      return { success: false, message: `Failed to update order status. ${updateOrderStatusError.message}.` };
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
      return { success: false, message: `Failed to clear cart. ${deleteCartErrorCompleted.message}.` };
    }

    return { success: true, message: 'Completed checkout session handled successfully' };
  } catch (error) {
    //Axiom error log
    return { success: false, message: 'Error handling completed checkout session' };
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
    //Axiom error log
    return { success: true, message: 'Error handling expired checkout session' };
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
      return { success: false, message: `Failed to update order status. ${updateOrderStatusError.message}.` };
    }

    return { success: true, message: 'Charge refund handled successfully' };
  } catch (error) {
    //Axiom error log
    return { success: true, message: 'Error handling charge refund' };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CustomResponse>> {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { success: false, message: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const { success: sessionCompletedSuccess, message: sessionCompletedMessage } =
        await handleCheckoutSessionCompleted(event);

      if (!sessionCompletedSuccess) {
        return NextResponse.json(
          {
            success: false,
            message: sessionCompletedMessage,
          },
          { status: 400 }
        );
      }
      break;

    case 'checkout.session.expired':
      const { success: sessionExpiredSuccess, message: sessionExpiredMessage } = await handleCheckoutSessionExpired(
        event
      );

      if (!sessionExpiredSuccess) {
        return NextResponse.json(
          {
            success: false,
            message: sessionExpiredMessage,
          },
          { status: 400 }
        );
      }
      break;

    case 'charge.refunded':
      const { success: chargeRefundedSuccess, message: chargeRefundedMessage } = await handleChargeRefunded(event);

      if (!chargeRefundedSuccess) {
        return NextResponse.json(
          {
            success: false,
            message: chargeRefundedMessage,
          },
          { status: 400 }
        );
      }
      break;

    default:
      break;
  }

  return NextResponse.json({ success: true, message: 'Webhook called successfully' }, { status: 200 });
}
