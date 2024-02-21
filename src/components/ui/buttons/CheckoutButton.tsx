'use client';

import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from './ContainedButton';
import { ContainedButtonButtonBackgroundColorType } from '@/types';
import { calculateDiscountedCartItemPrice } from '@/utils/calculateDiscountedPrice';
import { setCheckoutData } from '@/lib/redux/slices/checkoutDataSlice';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectDiscountTotal,
} from '@/lib/redux/selectors/cartSelectors';

type CheckoutButtonProps = ButtonProps & {
  disabled?: boolean;
  label: string;
  fullWidth?: boolean;
  backgroundColor: ContainedButtonButtonBackgroundColorType;
  height?: string | number;
  minHeight?: string | number;
};

export default function CheckoutButton({
  disabled,
  label,
  backgroundColor,
  fullWidth,
  height,
  minHeight,
  ...props
}: CheckoutButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const userId = useAppSelector((state) => state.user.userData?.userId);
  const cartTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);

  function handleCheckout() {
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
      disabled={disabled}
      onClick={handleCheckout}
      label={label}
      fullWidth={fullWidth}
      backgroundColor={backgroundColor}
      height={height}
      minHeight={minHeight}
      {...props}
    />
  );
}
