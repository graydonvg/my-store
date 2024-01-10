import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { toast } from 'react-toastify';
import BreadcrumbItem from '../breadcrumbs/BreadcrumbItem';
import { Payment } from '@mui/icons-material';
import ContainedButton from './ContainedButton';
import addOrder from '@/services/orders/add';
import addOrderItems from '@/services/orders/order-items/add';
import addOrderShippingDetails from '@/services/orders/shipping-details/add';

type Props = {
  showContainedButton?: boolean;
  showBreadcrumbButton?: boolean;
};

export default function PaymentButton({ showBreadcrumbButton = false, showContainedButton = false }: Props) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);

  async function handleCreateOrder() {
    const {
      success,
      message: addOrderMessage,
      data,
    } = await addOrder({
      userId: checkoutData.userId!,
      cartTotal: checkoutData.paymentTotals.cartTotal,
      deliveryFee: checkoutData.paymentTotals.deliveryFee,
      discountTotal: checkoutData.paymentTotals.discountTotal,
      orderTotal: checkoutData.paymentTotals.orderTotal,
    });

    if (success === true && !!data) {
      const createOrderItems = checkoutData.orderItems.map((item) => {
        return {
          ...item,
          orderId: data.orderId,
          userId: checkoutData.userId!,
        };
      });

      const createShippingDetails = {
        ...checkoutData.shippingDetails!,
        orderId: data.orderId,
        userId: checkoutData.userId!,
      };

      const addShippingDetailsPromise = await addOrderShippingDetails(createShippingDetails);
      const addOrderItemsPromise = await addOrderItems(createOrderItems);

      const [addShippingDetailsResponse, addOrderItemsResponse] = await Promise.all([
        addShippingDetailsPromise,
        addOrderItemsPromise,
      ]);

      const { success: addShippingDetailsSuccess, message: addShippingDetailsMessage } = addShippingDetailsResponse;
      const { success: addOrderItemsSuccess, message: addOrderItemsMessage } = addOrderItemsResponse;

      if (addShippingDetailsSuccess === true || addOrderItemsSuccess === true) {
        dispatch(setCheckoutData({ orderId: data.orderId }));
        return { success: true, message: addOrderMessage };
      } else if (addShippingDetailsSuccess === false) {
        return { success: false, message: addShippingDetailsMessage };
      } else if (addOrderItemsSuccess === false) {
        return { success: false, message: addOrderItemsMessage };
      } else {
        return { success: false, message: 'Failed to add order items and shipping details' };
      }
    } else {
      return { success: false, addOrderMessage };
    }
  }

  async function handlePayWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    const { success, message } = await handleCreateOrder();

    if (success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      return toast.error(message);
    }

    const error = await payWithStripe(cartItems);

    if (error?.success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(error.message);
    }
  }

  if (showContainedButton)
    return (
      <ContainedButton
        isDisabled={!checkoutData.shippingDetails || cartItems.length === 0}
        onClick={handlePayWithStripe}
        label={!checkoutData.isProcessing ? 'continue to payment' : ''}
        fullWidth
        backgroundColor={'red'}
        isLoading={checkoutData.isProcessing}
      />
    );

  if (showBreadcrumbButton)
    return (
      <BreadcrumbItem
        href="/checkout/payment"
        icon={<Payment />}
        label="payment"
        onLinkClick={handlePayWithStripe}
      />
    );
}
