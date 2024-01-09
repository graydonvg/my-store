'use client';

import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps, ListItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from './ContainedButton';
import { ContainedButtonButtonBackgroundColorType } from '@/types';
import { calculateDiscountedCartItemPrice } from '@/utils/calculateDiscountedPrice';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectDiscountTotal,
} from '@/lib/redux/cart/cartSelectors';

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
        productName: item?.product?.name!,
        productImageUrl: item?.product?.productImageData[0].imageUrl!,
        returnDetails: item?.product?.returnInfo!,
      };
    });
    dispatch(
      setCheckoutData({
        paymentTotals: { cartTotal, deliveryFee, orderTotal, discountTotal },
        orderItems: createOrderItems,
        userId: userId,
      })
    );

    if (isCartOpen.right === true) {
      dispatch(setIsCartOpen({ ...isCartOpen, right: false }));
    }

    router.push('/checkout/shipping');
  }

  return (
    <ContainedButton
      isDisabled={disabled}
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
