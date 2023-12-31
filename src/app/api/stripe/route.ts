import { CustomResponseType } from '@/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import createURL from '@/utils/createURL';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(request: Request): Promise<NextResponse<CustomResponseType<{ sessionId: string }>>> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession();

    if (!supabaseSession) return NextResponse.json({ success: false, message: 'Not authenticated.' });

    const response = await request.json();
    const lineItems = response;
    console.log('lineItems', lineItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${createURL('/checkout/payment')}?status=success`,
      cancel_url: `${createURL('/checkout/payment')}?status=cancel`,
    });

    console.log('session', session);

    return NextResponse.json({ success: true, message: 'Payment successfull.', data: { sessionId: session.id } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to process payment. An unexpect error occured.' });
  }
}
