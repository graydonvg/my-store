'use client';

import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { formatCurrency } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectOrderTotal,
  selectTotalDiscount,
  selectTotalToPay,
} from '@/lib/redux/cart/cartSelectors';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function CheckoutFlowLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const orderTotal = selectOrderTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const totalToPay = selectTotalToPay(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const dividerColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
  const isCartView = pathname.includes('/cart/view');
  const isShippingView = pathname.includes('/checkout/shipping');
  const isPaymentView = pathname.includes('/checkout/payment');

  function handleNavigate() {
    if (isCartView) {
      router.push('/checkout/shipping');
    } else if (isShippingView) {
      router.push('/checkout/payment');
    }
  }

  function renderOrderTotals({
    label,
    price,
    paddingRight,
    fontSize,
    fontWeight,
    backgroundColor,
  }: {
    label: string;
    price: string;
    paddingRight?: number;
    fontSize: number;
    fontWeight?: number;
    backgroundColor?: string;
  }) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 1,
          padding: 1,
          backgroundColor,
          borderRadius: '4px',
        }}>
        <Typography
          paddingRight={paddingRight}
          component="span"
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {label}
        </Typography>
        <Typography
          component="span"
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {price}
        </Typography>
      </Box>
    );
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
              paddingX: 2,
              paddingY: 4,
              backgroundColor: cardBackgroundColor,
              borderRadius: '4px',
            }}>
            <Typography
              component="h1"
              fontFamily="Source Sans Pro,sans-serif"
              fontSize={30}
              lineHeight={1}>
              Your Order
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 2 }}>
              {renderOrderTotals({
                label: 'Cart total',
                price: formatCurrency(orderTotal),
                paddingRight: 2,
                fontSize: 14,
              })}
              {totalDiscount > 0
                ? renderOrderTotals({
                    label: 'Discount total',
                    price: `-${formatCurrency(totalDiscount)}`,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: '#42a5f517',
                  })
                : null}
              {renderOrderTotals({
                label: 'Delivery fee',
                price: orderTotal > 0 ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : formatCurrency(0),
                paddingRight: 2,
                fontSize: 14,
              })}
              <Divider />
              {renderOrderTotals({
                label: 'Order total',
                price: formatCurrency(totalToPay),
                paddingRight: 2,
                fontSize: 14,
                fontWeight: 600,
              })}
              <Divider sx={{ border: `1.5px solid ${dividerColor}` }} />
              {renderOrderTotals({
                label: 'TOTAL TO PAY',
                price: formatCurrency(totalToPay),
                paddingRight: 2,
                fontSize: 18,
                fontWeight: 700,
              })}
            </Box>
            <ContainedButton
              disabled={cartItems.length === 0}
              onClick={handleNavigate}
              label={
                (isCartView && 'checkout now') ||
                (isShippingView && 'continue to payment') ||
                (isPaymentView && 'pay with card')
              }
              fullWidth
              backgroundColor={isCartView ? 'blue' : 'red'}
            />
          </Box>
        </Grid>
      </Grid>
    </CommonLayoutContainer>
  );
}
