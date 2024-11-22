import { loadStripe } from '@stripe/stripe-js';
import { createStripeCheckoutSession } from '@/services/stripe/create-stripe-checkout-session';
import { StripeLineItem } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function createNewStripeCheckoutSession(orderId: number, lineItems: StripeLineItem[]) {
  const logger = log.with({ context: 'createNewStripeCheckoutSession' });
  logger.info('Creating new stripe checkout session');

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

    if (!createStripeSessionData) {
      const errorMessage = 'Failed to get stripe session ID';
      logger.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }

    const error = await stripe?.redirectToCheckout({
      sessionId: createStripeSessionData.sessionId,
    });

    if (error?.error) {
      logger.error('Failed to process payment', { error });

      if (error.error.type === 'card_error') {
        return { success: false, message: error.error.message };
      } else {
        return { success: false, message: 'Failed to process payment. Please try again later' };
      }
    }

    return { success: true, message: 'Payment processed successfully.' };
  } catch (error) {
    logger.error('Failed to process payment', { error });

    return {
      success: false,
      message: 'Failed to process payment. An unexpected error occured.',
      data: error,
    };
  }
}

export async function resumeStripeCheckout(sessionId: string) {
  const logger = log.with({ context: 'resumeStripeCheckout' });
  logger.info('Resuming stripe checkout');

  try {
    const stripe = await stripePromise;

    const error = await stripe?.redirectToCheckout({
      sessionId,
    });

    if (error?.error) {
      if (error.error.type === 'card_error') {
        return { success: false, message: error.error.message };
      } else {
        return { success: false, message: 'Failed to process payment. Please try again later' };
      }
    }

    return { success: true, message: 'Payment processed successfully.' };
  } catch (error) {
    logger.error('Failed to process payment', { error });

    return {
      success: false,
      message: 'Failed to process payment. An unexpected error occured.',
      data: error,
    };
  }
}
