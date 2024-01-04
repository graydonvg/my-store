'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, List, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';
import CartItemSmall from './CartItemSmall';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { borderRadius } from '@/constants/styles';
import { usePathname } from 'next/navigation';

type CartEmptyMessageProps = {
  show: boolean;
};

function CartEmptyMessage({ show }: CartEmptyMessageProps) {
  if (!show) return null;

  return (
    <Box sx={{ padding: 1, marginTop: 2, borderRadius: borderRadius }}>
      <Typography>Your cart is empty</Typography>
    </Box>
  );
}

type CartItemsProps = {
  show: boolean;
};

function CartItems({ show }: CartItemsProps) {
  const pathname = usePathname();
  const { cartItems } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const dividerColor =
    mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const isShippingView = pathname.includes('/checkout/shipping');

  if (!show) return null;

  return cartItems.map((item, index) => {
    const isLastItem = cartItems.length - 1 === index;
    let showDivider;

    if (!isShippingView) {
      showDivider = true;
    } else if (isShippingView && !isLastItem) {
      showDivider = true;
    }

    return (
      <Fragment key={item?.cart_item_id}>
        <CartItemSmall item={item} />
        {showDivider ? <Divider sx={{ borderColor: dividerColor }} /> : null}
      </Fragment>
    );
  });
}

type SmallCartItemListProps = {
  paddingX?: number | string;
};

export default function SmallCartItemList({ paddingX = 0 }: SmallCartItemListProps) {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <List
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingX: paddingX,
        height: 1,
      }}>
      <CartEmptyMessage show={cartItems.length === 0} />
      <CartItems show={cartItems.length > 0} />
    </List>
  );
}
