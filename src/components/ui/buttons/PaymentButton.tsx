import { setCheckoutData } from '@/lib/redux/slices/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { toast } from 'react-toastify';
import BreadcrumbItem from '../breadcrumbs/BreadcrumbItem';
import { Payment } from '@mui/icons-material';
import ContainedButton from './ContainedButton';
import addOrder from '@/services/orders/add';

type Props = {
  buttonVariant: 'contained' | 'breadcrumb';
};

export default function PaymentButton({ buttonVariant }: Props) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);

  async function addNewOrder() {
    const { success, message, data } = await addOrder({
      orderDetails: {
        cartTotal: checkoutData.paymentTotals.cartTotal,
        deliveryFee: checkoutData.paymentTotals.deliveryFee,
        discountTotal: checkoutData.paymentTotals.discountTotal,
        orderTotal: checkoutData.paymentTotals.orderTotal,
      },
      orderItems: checkoutData.orderItems,
      shippingDetails: checkoutData.shippingDetails!,
    });

    if (!success) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(message);
      return { success };
    }

    dispatch(setCheckoutData({ orderId: data?.orderId }));

    return { success };
  }

  async function createOrderAndPayWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    const { success: addNewOrderSuccess } = await addNewOrder();

    if (addNewOrderSuccess) {
      const { success: paymentSuccess } = await payWithStripe(cartItems);

      if (!paymentSuccess) {
        dispatch(setCheckoutData({ isProcessing: false }));
        toast.error('Failed to process payment. Please try again later.');
      }
    }
  }

  return (
    <>
      {buttonVariant === 'contained' ? (
        <ContainedButton
          disabled={!checkoutData.shippingDetails || cartItems.length === 0 || checkoutData.isProcessing}
          onClick={createOrderAndPayWithStripe}
          label={!checkoutData.isProcessing ? 'pay with stripe' : ''}
          fullWidth
          color="secondary"
          isLoading={checkoutData.isProcessing}
        />
      ) : null}

      {buttonVariant === 'breadcrumb' ? (
        <BreadcrumbItem
          href="/checkout/payment"
          icon={<Payment />}
          label="payment"
          onLinkClick={createOrderAndPayWithStripe}
        />
      ) : null}
    </>
  );
}
