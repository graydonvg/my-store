import { loadStripe } from '@stripe/stripe-js';
import { createStripeCheckoutSession } from '@/services/stripe/create-stripe-checkout-session';
import { StripeLineItem } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createNewStripeCheckoutSession(orderId: number, lineItems: StripeLineItem[]) {
  try {
    const stripe = await stripePromise;

    const {
      success: createStripeSessionSuccess,
      message: createStripeSessionMessage,
      data: createStripeSessionData,
    } = await createStripeCheckoutSession({ orderId, lineItems });

    if (!createStripeSessionSuccess) {
      return {
        success: false,
        message: createStripeSessionMessage,
      };
    }

    const error = await stripe?.redirectToCheckout({
      sessionId: createStripeSessionData?.sessionId!,
    });

    if (error?.error) {
      // Axiom error log
      if (error.error.type === 'card_error') {
        return { success: false, message: error.error.message };
      } else {
        return { success: false, message: 'Failed to process payment. Please try again later' };
      }
    }

    return { success: true, message: 'Payment processed successfully.' };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process payment. An unexpected error occured.',
      data: error,
    };
  }
}

export async function resumeStripeCheckout(sessionId: string) {
  const stripe = await stripePromise;

  const error = await stripe?.redirectToCheckout({
    sessionId,
  });

  if (error?.error) {
    // Axiom error log
    if (error.error.type === 'card_error') {
      return { success: false, message: error.error.message };
    } else {
      return { success: false, message: 'Failed to process payment. Please try again later' };
    }
  }

  return { success: true, message: 'Payment processed successfully.' };
}
