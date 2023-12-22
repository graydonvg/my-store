'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, List, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';
import CartItemSmall from './CartItemSmall';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

export default function SmallCartItemList() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const dividerColor =
    mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;

  return (
    <List
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingX: 2,
        height: 1,
      }}>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <Fragment key={item?.cart_item_id}>
            <CartItemSmall item={item} />
            <Divider sx={{ borderColor: dividerColor }} />
          </Fragment>
        ))
      ) : (
        <Box sx={{ padding: 1, marginTop: 2, borderRadius: '4px' }}>
          <Typography>Your cart is empty</Typography>
        </Box>
      )}
    </List>
  );
}
