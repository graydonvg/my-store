import { CustomResponse, StripeCheckoutSessionResponse } from '@/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import createURL from '@/utils/createURL';
import { ERROR_MESSAGES } from '@/config';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(request: Request): Promise<NextResponse<CustomResponse<StripeCheckoutSessionResponse>>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const lineItems = await request.json();

    if (!user)
      return NextResponse.json({
        success: false,
        message: `Failed to create a Stripe session. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${createURL('/checkout/payment')}?payment-status=success`,
      cancel_url: `${createURL('/cart/view')}?payment-status=cancel`,
    });

    return NextResponse.json({ success: true, message: 'Payment successful.', data: { sessionId: session.id } });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to process payment. An unexpect error occured.',
    });
  }
}
