import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createNewStripeCheckoutSession } from '@/utils/stripe/stripeCheckout';
import { toast } from 'react-toastify';
import ContainedButton from '../simple/ContainedButton';
import { InsertOrderDb } from '@/types';
import addOrder from '@/services/orders/add';
import { Payment } from '@mui/icons-material';
import { getLineItemsFromCartItems } from '@/utils/stripe/getStripeLineItems';

export default function PaymentButton() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkout);

  async function addOrderAndCheckoutWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    const orderData: InsertOrderDb = {
      orderDetails: {
        cartTotal: checkoutData.paymentTotals.cartTotal,
        deliveryFee: checkoutData.paymentTotals.deliveryFee,
        discountTotal: checkoutData.paymentTotals.discountTotal,
        orderTotal: checkoutData.paymentTotals.orderTotal,
        orderStatus: 'awaiting payment',
      },
      orderItems: checkoutData.orderItems,
      shippingDetails: checkoutData.shippingDetails!,
    };

    const { success: addOrderSuccess, message: addOrderMessage, data: addOrderData } = await addOrder(orderData);

    if (!addOrderSuccess) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(addOrderMessage);
      return;
    }

    const orderId = addOrderData?.orderId!;
    const lineItems = getLineItemsFromCartItems(cartItems);

    const { success: stripeCheckoutSuccess, message: stripeCheckoutMessage } = await createNewStripeCheckoutSession(
      orderId,
      lineItems
    );

    if (!stripeCheckoutSuccess) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(stripeCheckoutMessage);
    }
  }

  return (
    <ContainedButton
      disabled={!checkoutData.shippingDetails || cartItems.length === 0 || checkoutData.isProcessing}
      onClick={addOrderAndCheckoutWithStripe}
      label={!checkoutData.isProcessing ? 'pay with stripe' : ''}
      fullWidth
      color="secondary"
      isLoading={checkoutData.isProcessing}
      startIcon={<Payment />}
    />
  );
}
