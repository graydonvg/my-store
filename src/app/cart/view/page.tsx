'use client';

import CartItem from '@/components/CartItem';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { selectCartTotal, selectTotalDiscount } from '@/lib/redux/cart/cartSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { formatCurrency } from '@/lib/utils';
import { Box, Divider, Grid, List, Typography, useTheme } from '@mui/material';

type Props = {};

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';

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
            <Box
              key={item?.cart_item_id}
              sx={{ backgroundColor: cardBackgroundColor, paddingX: 2, borderRadius: '4px' }}>
              <CartItem item={item} />
            </Box>
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
                paddingRight={2}
                component="span"
                fontSize={14}
                fontWeight={600}>
                Discount total
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                {formatCurrency(totalDiscount)}
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
                {cartTotal > 500 ? 'FREE' : formatCurrency(100)}
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
                {formatCurrency(cartTotal - totalDiscount)}
              </Typography>
            </Box>
            <Divider sx={{ border: '1.5px solid rgba(0, 0, 0, 0.12)' }} />
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
                {formatCurrency(cartTotal - totalDiscount)}
              </Typography>
            </Box>
          </Box>
          <ContainedButton
            label="checkout now"
            fullWidth
            backgroundColor="blue"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
