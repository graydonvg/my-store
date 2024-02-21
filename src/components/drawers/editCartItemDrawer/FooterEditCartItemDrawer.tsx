'use client';

import { Box } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { Delete, FavoriteBorder } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from '../../ui/buttons/TextButton';
import QuantityPickerEditCartItemDrawer from './QuantityPickerEditCartItemDrawer';

type Props = {
  cartItem: CartItemType;
  isUpdatingCartItem: boolean;
  isRemovingCartItem: boolean;
  setCartItemQuantityOnClick: (cartItemId: string, value: number) => void;
  removeCartItemOnClick: () => void;
};

export default function FooterEditCartItemDrawer({
  cartItem,
  isUpdatingCartItem,
  isRemovingCartItem,
  removeCartItemOnClick,
  setCartItemQuantityOnClick,
}: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        padding: 2,
        paddingTop: 0,
        gap: 2,
        opacity: isUpdatingCartItem ? 0.5 : 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          boxShadow: `0 -2px 4px 0 ${colorPalette.boxShadow}`,
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
        },
      }}>
      <QuantityPickerEditCartItemDrawer
        cartItem={cartItem}
        setCartItemQuantityOnClick={setCartItemQuantityOnClick}
      />
      <TextButton
        label="move to wishlist"
        labelColor={colorPalette.typography}
        startIcon={<FavoriteBorder />}
      />
      <TextButton
        disabled={isRemovingCartItem}
        onClick={removeCartItemOnClick}
        label={'remove'}
        labelColor={colorPalette.typography}
        startIcon={<Delete />}
      />
    </Box>
  );
}
