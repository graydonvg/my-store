import { Box, useTheme } from '@mui/material';
import { Delete, FavoriteBorder } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from '../../ui/buttons/TextButton';
import QuantityPickerEditCartItemDrawer from './QuantityPickerEditCartItemDrawer';

type Props = {
  cartItem: CartItemType;
  isUpdatingCartItem: boolean;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeCartItem: () => void;
  moveToWishlist: () => void;
};

export default function BottomEditCartItemDrawer({
  cartItem,
  isUpdatingCartItem,
  removeCartItem,
  updateCartItemQuantity,
  moveToWishlist,
}: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        padding: 2,
        gap: 2,
        opacity: isUpdatingCartItem ? 0.5 : 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          boxShadow: `0 -2px 4px 0 ${theme.palette.custom.boxShadow}`,
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
        },
      }}>
      <QuantityPickerEditCartItemDrawer
        cartItem={cartItem}
        updateCartItemQuantity={updateCartItemQuantity}
      />
      <TextButton
        onClick={moveToWishlist}
        label="move to wishlist"
        labelColor={theme.palette.custom.typography}
        startIcon={<FavoriteBorder />}
      />
      <TextButton
        onClick={removeCartItem}
        label={'remove'}
        labelColor={theme.palette.custom.typography}
        startIcon={<Delete />}
      />
    </Box>
  );
}
