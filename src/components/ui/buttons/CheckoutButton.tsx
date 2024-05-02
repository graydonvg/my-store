import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from './ContainedButton';
import { calculateDiscountedCartItemPrice } from '@/utils/calculateDiscountedPrice';
import { setCheckoutData } from '@/lib/redux/slices/checkoutDataSlice';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectDiscountTotal,
} from '@/lib/redux/selectors/cartSelectors';

type Props = ButtonProps & {
  disabled?: boolean;
  label: string;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function CheckoutButton({ disabled, label, sxStyles, ...props }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const userId = useAppSelector((state) => state.user.data?.userId);
  const cartTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);

  function checkout() {
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
        userId: userId,
      })
    );

    if (isCartOpen === true) {
      dispatch(setIsCartOpen(false));
    }

    router.push('/checkout/shipping');
  }

  return (
    <ContainedButton
      color="secondary"
      disabled={disabled}
      onClick={checkout}
      label={label}
      sxStyles={sxStyles}
      {...props}
    />
  );
}
