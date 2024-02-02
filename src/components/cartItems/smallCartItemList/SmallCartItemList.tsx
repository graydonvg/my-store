'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { BORDER_RADIUS } from '@/config';
import SmallCartItems from './SmallCartItems';

type Props = {
  paddingX?: number | string;
};

export default function SmallCartItemList({ paddingX = 0 }: Props) {
  const colorPalette = useColorPalette();
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
      {cartItems.length === 0 ? (
        <Box
          sx={{
            padding: 1,
            marginTop: 2,
            borderRadius: BORDER_RADIUS,
            backgroundColor: colorPalette.navBar.lower.background,
          }}>
          <Typography
            lineHeight={1}
            component="p"
            fontSize={24}>
            Your cart is empty.
          </Typography>
        </Box>
      ) : null}
      {cartItems.length > 0 ? <SmallCartItems /> : null}
    </List>
  );
}
