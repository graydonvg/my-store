import { CustomResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import createSupabaseService from '@/lib/supabase/supabase-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(request: NextRequest): Promise<NextResponse<CustomResponse>> {
  const supabase = createSupabaseService();

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
    return NextResponse.json({ success: false, message: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata!.orderId;

    const { error } = await supabase.from('orders').update({ orderStatus: 'paid' }).eq('orderId', orderId);

    if (error) {
      return NextResponse.json(
        { success: false, message: `Failed to update order payment status. ${error.message}.` },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ success: true, message: 'Webhook called successfully.' }, { status: 200 });
}
