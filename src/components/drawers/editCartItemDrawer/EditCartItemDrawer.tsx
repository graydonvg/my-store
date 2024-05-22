import { Box, useTheme } from '@mui/material';
import DrawerComponent from '../../ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';
import { toast } from 'react-toastify';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update';
import { deleteItemFromCart } from '@/services/cart/delete';
import EditCartItemDrawerSizePicker from './EditCartItemDrawerSizePicker';
import BottomEditCartItemDrawer from './BottomEditCartItemDrawer';
import EditCartItemDrawerLoader from './EditCartItemDrawerLoader';
import { setCartItemQuantityWillUpdate } from '@/lib/redux/features/cart/cartSlice';
import {
  setCartItemToEditId,
  setIsRemovingCartItem,
  setIsUpdatingCartItemQuantity,
  setIsUpdatingCartItemSize,
} from '@/lib/redux/features/editCartItemDrawer/editCartItemDrawerSlice';
import { selectCartItemQuantityWillUpdate, selectCartItems } from '@/lib/redux/features/cart/cartSelectors';
import {
  selectCartItemToEditId,
  selectIsMovingToWishlist,
  selectIsRemovingCartItem,
  selectIsUpdatingCartItemQuantity,
  selectIsUpdatingCartItemSize,
} from '@/lib/redux/features/editCartItemDrawer/editCartItemDrawerSelectors';

type Props = {
  cartItem: CartItem;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const cartItems = useAppSelector(selectCartItems);
  const cartItemQuantityWillUpdate = useAppSelector(selectCartItemQuantityWillUpdate);
  const cartItemToEditId = useAppSelector(selectCartItemToEditId);
  const isMovingToWishlist = useAppSelector(selectIsMovingToWishlist);
  const isRemovingCartItem = useAppSelector(selectIsRemovingCartItem);
  const isUpdatingCartItemQuantity = useAppSelector(selectIsUpdatingCartItemQuantity);
  const isUpdatingCartItemSize = useAppSelector(selectIsUpdatingCartItemSize);
  const isUpdatingCartItem =
    isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize || isMovingToWishlist;

  function closeDrawer() {
    if (isUpdatingCartItem || cartItemQuantityWillUpdate) return;
    dispatch(setCartItemToEditId(null));
  }

  async function removeCartItem() {
    dispatch(setIsRemovingCartItem(true));

    const { success, message } = await deleteItemFromCart(cartItem?.cartItemId!);

    if (success) {
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsRemovingCartItem(false));
  }

  async function updateItemQuantity(cartItemId: string, newQuantity: number) {
    dispatch(setIsUpdatingCartItemQuantity(true));
    dispatch(setCartItemQuantityWillUpdate(false));

    const { success, message } = await updateCartItemQuantity({
      cartItemId: cartItemId,
      quantity: newQuantity,
    });

    if (success) {
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsUpdatingCartItemQuantity(false));
  }

  async function updateItemSize(size: string) {
    if (size === cartItem?.size) return;

    dispatch(setIsUpdatingCartItemSize(true));

    const itemOfSelectedSizeExists = cartItems.find(
      (item) =>
        item?.product?.productId === cartItem?.product?.productId &&
        item?.size === size &&
        item.cartItemId !== cartItem?.cartItemId
    );

    // If an item with the selected size already exists, update the quantity of that item and remove the old item. Else, update the size.
    if (itemOfSelectedSizeExists) {
      const newQuantity = itemOfSelectedSizeExists.quantity + cartItem?.quantity!;

      await updateItemQuantity(itemOfSelectedSizeExists.cartItemId, newQuantity);

      await removeCartItem();
    } else {
      const { success, message } = await updateCartItemSize({
        cartItemId: cartItem?.cartItemId!,
        size,
      });

      if (success) {
        router.refresh();
      } else {
        toast.error(message);
      }
    }

    dispatch(setIsUpdatingCartItemSize(false));
  }

  return (
    <DrawerComponent
      isOpen={{
        right: cartItemToEditId === cartItem?.cartItemId,
      }}
      closeDrawer={closeDrawer}
      drawerProps={{ sx: { zIndex: theme.zIndex.appBar + 1 } }}
      paperProps={{
        sx: {
          width: { xs: '80vw', sm: '350px' },
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))',
        },
      }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}>
        {isUpdatingCartItem ? <EditCartItemDrawerLoader isUpdatingCartItem={isUpdatingCartItem} /> : null}
        <EditCartItemDrawerSizePicker
          cartItem={cartItem}
          isUpdatingCartItem={isUpdatingCartItem}
          setCartItemSizeOnClick={updateItemSize}
        />
        <BottomEditCartItemDrawer
          cartItem={cartItem}
          isUpdatingCartItem={isUpdatingCartItem}
          updateCartItemQuantity={updateItemQuantity}
          removeCartItem={removeCartItem}
        />
      </Box>
    </DrawerComponent>
  );
}
