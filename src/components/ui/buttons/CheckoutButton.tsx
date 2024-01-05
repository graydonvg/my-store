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
  selectTotalDiscount,
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
  const { isCartOpen } = useAppSelector((state) => state.cart);
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);

  function handleCheckout() {
    const createOrderItems = cartItems.map((item) => {
      const price_paid = item?.product?.on_sale ? calculateDiscountedCartItemPrice(item) : item?.product?.price;
      return {
        product_id: item?.product?.product_id!,
        quantity: item?.quantity!,
        size: item?.size!,
        price_paid: price_paid!,
        product_name: item?.product?.name!,
        product_image_url: item?.product?.product_image_data[0].image_url!,
        return_details: item?.product?.return_info!,
      };
    });
    dispatch(
      setCheckoutData({
        paymentTotals: { cartTotal, deliveryFee, orderTotal, totalDiscount },
        orderItems: createOrderItems,
      })
    );

    if (isCartOpen.right === true) {
      dispatch(setIsCartOpen({ ...isCartOpen, right: false }));
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
