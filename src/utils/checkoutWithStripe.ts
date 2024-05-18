import { loadStripe } from '@stripe/stripe-js';
import { calculateDiscountedCartItemPrice } from './calculate';
import { createStripeCheckoutSession } from '@/services/stripe/create-stripe-checkout-session';
import { CartItem } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function checkoutWithStripe(orderId: string, cartItems: CartItem[]) {
  try {
    const stripe = await stripePromise;

    const lineItems = cartItems.map((item) => {
      const unitAmount =
        item?.product?.isOnSale === 'Yes' ? calculateDiscountedCartItemPrice(item) : item?.product?.price!;
      const roundedAmount = Math.round(unitAmount) * 100;
      const images = [...item?.product?.productImageData!]
        .sort((a, b) => a.index - b.index)
        .map((image) => image.imageUrl);

      return {
        price_data: {
          currency: 'zar',
          product_data: {
            name: item.product!.name,
            images,
          },
          unit_amount: roundedAmount,
        },
        quantity: item?.quantity,
      };
    });

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
