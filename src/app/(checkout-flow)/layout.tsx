'use client';

import { ReactNode, useState } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectTotalDiscount,
  selectOrderTotal,
} from '@/lib/redux/cart/cartSelectors';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { borderRadius } from '@/constants/styles';
import { loadStripe } from '@stripe/stripe-js';
import { callStripeSession } from '@/services/stripe/call-stripe-session';
import { calculateDiscountedCartItemPrice, calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import OrderTotals from '@/components/OrderTotals';
import payWithStripe from '@/utils/payWithStripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: Props) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const isCartView = pathname.includes('/cart/view');
  const isShippingView = pathname.includes('/checkout/shipping');

  function handleNavigate() {
    dispatch(setCheckoutData({ ...checkoutData, totalToPay: orderTotal }));
    router.push('/checkout/shipping');
  }

  async function handlePayWithStripe() {
    await payWithStripe(cartItems);
  }

  return (
    <CommonLayoutContainer>
      <Grid
        container
        spacing={2}>
        <Grid
          item
          xs={12}
          md={9}>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          md={3}>
          <Box
            sx={{
              paddingX: 3,
              paddingY: 4,
              backgroundColor: cardBackgroundColor,
              borderRadius: borderRadius,
            }}>
            <Typography
              component="h1"
              fontFamily="Source Sans Pro,sans-serif"
              fontSize={30}
              lineHeight={1}>
              Your Order
            </Typography>
            <OrderTotals
              cartTotal={cartTotal}
              totalDiscount={totalDiscount}
              deliveryFee={deliveryFee}
              orderTotal={orderTotal}
              totalToPay={orderTotal}
            />
            <ContainedButton
              disabled={cartItems.length === 0 || (isShippingView && !checkoutData.shippingAddress)}
              onClick={isCartView ? handleNavigate : handlePayWithStripe}
              label={(isCartView && 'checkout now') || (isShippingView && 'continue to payment')}
              fullWidth
              backgroundColor={isCartView ? 'blue' : 'red'}
            />
          </Box>
        </Grid>
      </Grid>
    </CommonLayoutContainer>
  );
}
