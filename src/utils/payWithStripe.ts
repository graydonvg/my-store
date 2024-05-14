import { loadStripe } from '@stripe/stripe-js';
import { calculateDiscountedCartItemPrice } from './calculate';
import { callStripeSession } from '@/services/stripe/call-stripe-session';
import { CartItem } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function payWithStripe(cartItems: CartItem[]) {
  try {
    const stripe = await stripePromise;

    const createLineItems = cartItems.map((item) => {
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
            name: item?.product?.name,
            images,
          },
          unit_amount: roundedAmount,
        },
        quantity: item?.quantity,
      };
    });

    const { data } = await callStripeSession(createLineItems);

    const error = await stripe?.redirectToCheckout({
      sessionId: data?.sessionId!,
    });

    if (error) {
      // Axiom error log
      const message = error.error.message ? error.error.message : 'Failed to process payment.';

      return { success: false, message: message };
    }

    return { success: true, message: 'Payment successful.' };
  } catch (error) {
    return { success: false, message: 'Failed to process payment. An unexpected error occured.', data: error };
  }
}
