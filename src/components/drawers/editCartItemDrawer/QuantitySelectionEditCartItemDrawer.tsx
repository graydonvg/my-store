'use client';

import { Box, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';

type Props = {
  cartItem: CartItemType;
  setCartItemQuantityOnClick: (cartItemId: string, value: number) => void;
};

export default function QuantitySelectionEditCartItemDrawer({ cartItem, setCartItemQuantityOnClick }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 1,
      }}>
      <Typography
        component="span"
        fontWeight={600}
        fontSize={14}
        sx={{ textTransform: 'uppercase' }}>
        Quantity
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton
          onClick={() => setCartItemQuantityOnClick(cartItem.cartItemId, -1)}
          sx={{
            color: 'inherit',
            height: '48px',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'inherit',
            },
          }}>
          <Remove fontSize="small" />
        </IconButton>
        <Typography
          component="span"
          fontWeight={600}
          fontSize={16}
          sx={{ width: '4ch', display: 'grid', placeItems: 'center' }}>
          {cartItem?.quantity}
        </Typography>
        <IconButton
          onClick={() => setCartItemQuantityOnClick(cartItem.cartItemId, 1)}
          sx={{
            color: 'inherit',
            height: '48px',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}>
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
