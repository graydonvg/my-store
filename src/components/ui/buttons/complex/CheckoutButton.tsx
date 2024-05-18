import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from '../simple/ContainedButton';
import { calculateDiscountedCartItemPrice } from '@/utils/calculate';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectDiscountTotal,
} from '@/lib/redux/features/cart/cartSelectors';

type Props = ButtonProps & {
  disabled?: boolean;
  label: string;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function CheckoutButton({ disabled, label, sxStyles, ...props }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);

  function dispatchCheckoutData() {
    const createOrderItems = cartItems.map((item) => {
      const pricePaid =
        item?.product?.isOnSale === 'Yes' ? calculateDiscountedCartItemPrice(item) : item?.product?.price;

      return {
        productId: item?.product?.productId!,
        quantity: item?.quantity!,
        size: item?.size!,
        pricePaid: pricePaid!,
      };
    });

    dispatch(
      setCheckoutData({
        paymentTotals: { cartTotal, deliveryFee, orderTotal, discountTotal },
        orderItems: createOrderItems,
      })
    );

    router.push('/checkout/shipping');
  }

  return (
    <ContainedButton
      color="secondary"
      disabled={disabled}
      onClick={dispatchCheckoutData}
      label={label}
      sxStyles={sxStyles}
      {...props}
    />
  );
}
