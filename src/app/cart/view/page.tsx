'use client';

import CartItemLarge from '@/components/CartItemLarge';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectTotalDiscount,
  selectTotalToPay,
} from '@/lib/redux/cart/cartSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { formatCurrency } from '@/lib/utils';
import { Box, Divider, Grid, List, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function CartView() {
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const totalToPay = selectTotalToPay(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const dividerColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';

  function handleGoToCheckout() {
    router.push('/checkout/shipping');
  }

  return (
    <Grid
      container
      spacing={2}>
      <Grid
        item
        xs={12}
        md={9}>
        <List
          disablePadding
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.map((item) => (
            <CartItemLarge
              key={item?.cart_item_id}
              item={item}
            />
          ))}
        </List>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 2, paddingX: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 1, paddingY: 1 }}>
              <Typography
                paddingRight={2}
                component="span"
                fontSize={14}>
                Cart total
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {formatCurrency(cartTotal)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 1,
                paddingY: 1,
              }}>
              <Typography
                // paddingRight={2}
                component="span"
                fontSize={14}
                fontWeight={600}>
                Discount total
              </Typography>
              <Typography
                noWrap
                component="span"
                fontSize={14}
                fontWeight={600}>
                {`-${formatCurrency(totalDiscount)}`}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 1,
                paddingY: 1,
              }}>
              <Typography
                paddingRight={2}
                component="span"
                fontSize={14}>
                Delivery fee
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 1,
                paddingY: 1,
              }}>
              <Typography
                paddingRight={2}
                component="span"
                fontSize={14}
                fontWeight={600}>
                Order total
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                {formatCurrency(totalToPay)}
              </Typography>
            </Box>
            <Divider sx={{ border: `1.5px solid ${dividerColor}` }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 1,
                paddingY: 1,
              }}>
              <Typography
                paddingRight={2}
                component="span"
                fontSize={18}
                fontWeight={700}>
                TOTAL TO PAY
              </Typography>
              <Typography
                component="span"
                fontSize={18}
                fontWeight={700}>
                {formatCurrency(totalToPay)}
              </Typography>
            </Box>
          </Box>
          <ContainedButton
            onClick={handleGoToCheckout}
            label="checkout now"
            fullWidth
            backgroundColor="blue"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
