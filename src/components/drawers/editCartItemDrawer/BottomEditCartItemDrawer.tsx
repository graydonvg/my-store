import { Box, Divider, useTheme } from '@mui/material';
import { Delete, FavoriteBorder } from '@mui/icons-material';
import { CartItem } from '@/types';
import TextButton from '../../ui/buttons/simple/TextButton';
import EditCartItemDrawerQuantityPicker from './EditCartItemDrawerQuantityPicker';

type Props = {
  cartItem: CartItem;
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
    <Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          padding: 2,
          gap: 2,
          opacity: isUpdatingCartItem ? 0.5 : 1,
        }}>
        <EditCartItemDrawerQuantityPicker
          cartItem={cartItem}
          updateCartItemQuantity={updateCartItemQuantity}
        />
        <TextButton
          onClick={moveToWishlist}
          label="move to wishlist"
          startIcon={<FavoriteBorder />}
          sxStyles={{ color: theme.palette.text.primary, paddingX: 0 }}
        />
        <TextButton
          onClick={removeCartItem}
          label={'remove'}
          startIcon={<Delete />}
          sxStyles={{ color: theme.palette.text.primary, paddingX: 0 }}
        />
      </Box>
    </Box>
  );
}
