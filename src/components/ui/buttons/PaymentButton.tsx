import { setCheckoutData } from '@/lib/redux/slices/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { toast } from 'react-toastify';
import BreadcrumbItem from '../breadcrumbs/BreadcrumbItem';
import { Payment } from '@mui/icons-material';
import ContainedButton from './ContainedButton';
import addOrder from '@/services/orders/add';

type Props = {
  showContainedButton?: boolean;
  showBreadcrumbButton?: boolean;
};

export default function PaymentButton({ showBreadcrumbButton = false, showContainedButton = false }: Props) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);

  async function addNewOrder() {
    const { success, message, data } = await addOrder({
      orderDetails: {
        isPaid: false,
        cartTotal: checkoutData.paymentTotals.cartTotal,
        deliveryFee: checkoutData.paymentTotals.deliveryFee,
        discountTotal: checkoutData.paymentTotals.discountTotal,
        orderTotal: checkoutData.paymentTotals.orderTotal,
      },
      orderItems: checkoutData.orderItems,
      shippingDetails: checkoutData.shippingDetails!,
    });

    if (success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(message);
      return;
    }

    dispatch(setCheckoutData({ orderId: data?.orderId }));
  }

  async function createOrderAndPayWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    await addNewOrder();

    const error = await payWithStripe(cartItems);

    if (error?.success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(error.message);
    }
  }

  return (
    <>
      {showContainedButton ? (
        <ContainedButton
          disabled={!checkoutData.shippingDetails || cartItems.length === 0 || checkoutData.isProcessing}
          onClick={createOrderAndPayWithStripe}
          label={!checkoutData.isProcessing ? 'pay with stripe' : ''}
          fullWidth
          backgroundColor={'warning'}
          isLoading={checkoutData.isProcessing}
        />
      ) : null}

      {showBreadcrumbButton ? (
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
