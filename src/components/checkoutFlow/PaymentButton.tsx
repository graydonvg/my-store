import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import ContainedButton from '../ui/buttons/simple/ContainedButton';
import { InsertOrder } from '@/types';
import addOrder from '@/services/orders/add';
import { Payment } from '@mui/icons-material';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';
import { selectCheckoutData } from '@/lib/redux/features/checkout/checkoutSelectors';
import { getLineItemsFromCartItems } from '@/utils/stripeHelpers';
import { createNewStripeCheckoutSession } from '@/services/stripe/checkout';

export default function PaymentButton() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const checkoutData = useAppSelector(selectCheckoutData);

  async function addOrderAndCheckoutWithStripe() {
    dispatch(setCheckoutData({ isCheckoutProcessing: true }));

    const orderData: InsertOrder = {
      orderDetails: {
        cartTotal: checkoutData.orderPaymentTotals.cartTotal,
        deliveryFee: checkoutData.orderPaymentTotals.deliveryFee,
        discountTotal: checkoutData.orderPaymentTotals.discountTotal,
        orderTotal: checkoutData.orderPaymentTotals.orderTotal,
        orderStatus: 'awaiting payment',
      },
      orderItems: checkoutData.checkoutItems,
      shippingDetails: checkoutData.orderShippingDetails!,
    };

    const { success: addOrderSuccess, message: addOrderMessage, data: addOrderData } = await addOrder(orderData);

    if (!addOrderSuccess) {
      dispatch(setCheckoutData({ isCheckoutProcessing: false }));
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
      dispatch(setCheckoutData({ isCheckoutProcessing: false }));
      toast.error(stripeCheckoutMessage);
    }
  }

  return (
    <ContainedButton
      disabled={!checkoutData.orderShippingDetails || cartItems.length === 0}
      onClick={addOrderAndCheckoutWithStripe}
      label={!checkoutData.isCheckoutProcessing ? 'pay with stripe' : ''}
      fullWidth
      color="secondary"
      isLoading={checkoutData.isCheckoutProcessing}
      startIcon={<Payment />}
    />
  );
}
