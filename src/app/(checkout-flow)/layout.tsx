'use client';

import { ReactNode, useCallback, useEffect } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectTotalDiscount,
  selectOrderTotal,
} from '@/lib/redux/cart/cartSelectors';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { borderRadius } from '@/constants/styles';
import OrderTotals from '@/components/orders/OrderTotals';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import PaymentButton from '@/components/ui/buttons/PaymentButton';
import deleteOrder from '@/services/orders/delete';

type NavButtonProps = {
  showCheckoutButton: boolean;
  showPaymentButton: boolean;
};

function NavButton({ showCheckoutButton, showPaymentButton }: NavButtonProps) {
  const { cartItems } = useAppSelector((state) => state.cart);

  if (showCheckoutButton)
    return (
      <CheckoutButton
        disabled={cartItems.length === 0}
        label={'checkout now'}
        fullWidth={true}
        backgroundColor={'blue'}
      />
    );

  if (showPaymentButton) return <PaymentButton showContainedButton={true} />;
}

type CheckoutFlowLayoutProps = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: CheckoutFlowLayoutProps) {
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);
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
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const deleteOrderOnCancel = useCallback(
    async function handleDeleteOrder() {
      await deleteOrder({
        user_id: checkoutData.userId!,
        order_id: checkoutData.orderId!,
      });
    },
    [checkoutData.orderId, checkoutData.userId]
  );

  useEffect(() => {
    if (paymentStatus === 'cancel' && checkoutData.isProcessing) {
      dispatch(setCheckoutData({ isProcessing: false }));

      if (!!checkoutData.orderId) {
        deleteOrderOnCancel();
      }
    }
  }, [dispatch, paymentStatus, checkoutData.orderId, deleteOrderOnCancel, checkoutData.isProcessing]);

  return (
    <CommonLayoutContainer>
      <Grid
        container
        columnSpacing={2}
        rowSpacing={0}>
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
            <Box sx={{ paddingY: 2 }}>
              <OrderTotals
                cartTotal={cartTotal}
                totalDiscount={totalDiscount}
                deliveryFee={deliveryFee}
                orderTotal={orderTotal}
                totalToPay={orderTotal}
              />
            </Box>
            <NavButton
              showCheckoutButton={isCartView}
              showPaymentButton={isShippingView}
            />
          </Box>
        </Grid>
      </Grid>
    </CommonLayoutContainer>
  );
}
