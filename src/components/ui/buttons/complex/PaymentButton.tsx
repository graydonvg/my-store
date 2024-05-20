import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import checkoutWithStripe from '@/utils/checkoutWithStripe';
import { toast } from 'react-toastify';
import ContainedButton from '../simple/ContainedButton';
import { InsertOrderDb } from '@/types';
import addOrder from '@/services/orders/add';
import { Payment } from '@mui/icons-material';

export default function PaymentButton() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkout);

  async function handleStripeCheckout() {
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

    const { success: checkoutWithStripeSuccess, message: checkoutWithStripeMessage } = await checkoutWithStripe(
      orderId,
      cartItems
    );

    if (!checkoutWithStripeSuccess) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(checkoutWithStripeMessage);
    }
  }

  return (
    <ContainedButton
      disabled={!checkoutData.shippingDetails || cartItems.length === 0 || checkoutData.isProcessing}
      onClick={handleStripeCheckout}
      label={!checkoutData.isProcessing ? 'pay with stripe' : ''}
      fullWidth
      color="secondary"
      isLoading={checkoutData.isProcessing}
      startIcon={<Payment />}
    />
  );
}
