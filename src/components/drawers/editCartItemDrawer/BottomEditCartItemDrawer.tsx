import { Box, Divider, useTheme } from '@mui/material';
import { Delete, FavoriteBorder } from '@mui/icons-material';
import { CartItem } from '@/types';
import EditCartItemDrawerQuantityPicker from './EditCartItemDrawerQuantityPicker';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsMovingToWishlist } from '@/lib/redux/features/editCartItemDrawer/editCartItemDrawerSlice';
import addItemToWishlist from '@/services/wishlist/add';
import { toast } from 'react-toastify';
import TextButton from '@/components/ui/buttons/simple/TextButton';
import { selectWishlistData } from '@/lib/redux/features/wishlistData/wishlistDataSelectors';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

type Props = {
  cartItem: CartItem;
  isUpdatingCartItem: boolean;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeCartItem: () => Promise<void>;
};

export default function BottomEditCartItemDrawer({
  cartItem,
  isUpdatingCartItem,
  removeCartItem,
  updateCartItemQuantity,
}: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const wishlistData = useAppSelector(selectWishlistData);

  async function moveToWishlist() {
    const itemExists = wishlistData.some(
      (item) => item.productId === cartItem.product?.productId && item.size === cartItem.size
    );

    if (itemExists) {
      toast.info('Already added to wishlist');
      return;
    }

    dispatch(setIsMovingToWishlist(true));

    const { success, message } = await addItemToWishlist({
      size: cartItem.size,
      productId: cartItem.product?.productId,
      userId: userData?.userId,
    });

    if (success) {
      await removeCartItem();
      toast.success('Moved to wishlist');
    } else {
      toast.error(message);
    }

    dispatch(setIsMovingToWishlist(false));
  }

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
