import { CustomResponse, StripeCheckoutData, StripeCheckoutSessionResponse } from '@/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import createURL from '@/utils/createURL';
import { ERROR_MESSAGES } from '@/data';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(request: Request): Promise<NextResponse<CustomResponse<StripeCheckoutSessionResponse>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const checkoutData: StripeCheckoutData = await request.json();

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to create a Stripe checkout session. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!checkoutData.orderId || !checkoutData.lineItems)
      return NextResponse.json({
        success: false,
        message: 'Failed to create a Stripe checkout session. Order data missing',
      });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: checkoutData.lineItems,
      mode: 'payment',
      success_url: `${createURL('/checkout/payment/confirmation')}?payment_status=success&order_id=${
        checkoutData.orderId
      }`,
      cancel_url: `${createURL('/cart/view')}?payment_status=cancelled&order_id=${checkoutData.orderId}`,
      metadata: { userId: authUser.id, orderId: checkoutData.orderId },
      payment_intent_data: {
        metadata: { userId: authUser.id, orderId: checkoutData.orderId },
      },
    });

    const { error } = await supabase
      .from('pendingCheckoutSessions')
      .insert({ sessionId: session.id, userId: authUser.id, orderId: checkoutData.orderId });

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add checkout session ID. ${error.message}.` });
    }

    return NextResponse.json({
      success: true,
      message: 'Stripe checkout session created successfully.',
      data: { sessionId: session.id },
    });
  } catch (error) {
    // Axiom error log
    return NextResponse.json({
      success: false,
      message: 'Failed to create a Stripe checkout session. An unexpect error occured.',
    });
  }
}
