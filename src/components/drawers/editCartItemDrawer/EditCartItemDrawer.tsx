import { Box, IconButton, useTheme } from '@mui/material';
import DrawerComponent from '../DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { CartItem } from '@/types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update';
import { deleteItemFromCart } from '@/services/cart/delete';
import SizePickerEditCartItemDrawer from './SizePickerEditCartItemDrawer';
import BottomEditCartItemDrawer from './BottomEditCartItemDrawer';
import LoaderEditCartItemDrawer from './LoaderEditCartItemDrawer';
import { setCartItemQuantityWillUpdate } from '@/lib/redux/slices/cartSlice';
import addItemToWishlist from '@/services/wishlist/add';

type Props = {
  cartItem: CartItem;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const userId = useAppSelector((state) => state.user.data?.userId);
  const { cartItems, cartItemQuantityWillUpdate } = useAppSelector((state) => state.cart);
  const [cartItemToEditId, setCartItemToEditId] = useState<string | null>(null);
  const [isUpdatingCartItemQuantity, setIsUpdatingCartItemQuantity] = useState(false);
  const [isUpdatingCartItemSize, setIsUpdatingCartItemSize] = useState(false);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);
  const isUpdatingCartItem =
    isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize || isMovingToWishlist;

  useEffect(() => {
    setIsUpdatingCartItemSize(false);
  }, [dispatch, cartItem?.size]);

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [cartItem]);

  function openDrawer(id: string | null) {
    setCartItemToEditId(id);
  }

  function closeDrawer() {
    if (isUpdatingCartItem || cartItemQuantityWillUpdate) return;
    setCartItemToEditId(null);
  }

  async function updateItemQuantity(cartItemId: string, newQuantity: number) {
    setIsUpdatingCartItemQuantity(true);
    dispatch(setCartItemQuantityWillUpdate(false));

    const { success, message } = await updateCartItemQuantity({
      cartItemId: cartItemId,
      quantity: newQuantity,
    });

    if (success === false) {
      toast.error(message);
    }

    router.refresh();
    setIsUpdatingCartItemQuantity(false);
  }

  async function updateItemSize(size: string) {
    // If an item with the selected size already exists, update the quantity of that item and remove the old item. Else, update the size.

    if (size === cartItem?.size) return;

    setIsUpdatingCartItemSize(true);

    const itemOfSelectedSizeExists = cartItems.find(
      (item) =>
        item?.product?.productId === cartItem?.product?.productId &&
        item?.size === size &&
        item.cartItemId !== cartItem?.cartItemId
    );

    if (itemOfSelectedSizeExists) {
      const newQuantity = itemOfSelectedSizeExists.quantity + cartItem?.quantity!;

      await updateItemQuantity(itemOfSelectedSizeExists.cartItemId, newQuantity);

      await removeCartItem();
    } else {
      const { success, message } = await updateCartItemSize({
        cartItemId: cartItem?.cartItemId!,
        size,
      });

      if (success === true) {
        router.refresh();
      } else {
        setIsUpdatingCartItemSize(false);
        toast.error(message);
      }
    }
  }

  async function removeCartItem() {
    setIsRemovingCartItem(true);

    const { success, message } = await deleteItemFromCart(cartItem?.cartItemId!);

    if (success === true) {
      router.refresh();
    } else {
      setIsRemovingCartItem(false);
      toast.error(message);
    }
  }

  async function moveToWishlist() {
    setIsMovingToWishlist(true);

    const { success, message } = await addItemToWishlist({
      size: cartItem.size,
      productId: cartItem.product?.productId,
      userId,
    });

    if (success === true) {
      await removeCartItem();
      toast.success('Moved to wishlist');
    } else {
      toast.error(message);
    }

    setIsMovingToWishlist(false);
  }

  return (
    <>
      <IconButton onClick={() => openDrawer(cartItem?.cartItemId)}>
        <Edit
          fontSize="small"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        />
      </IconButton>
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
          {isUpdatingCartItem ? <LoaderEditCartItemDrawer isUpdatingCartItem={isUpdatingCartItem} /> : null}
          <SizePickerEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            setCartItemSizeOnClick={updateItemSize}
          />
          <BottomEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            updateCartItemQuantity={updateItemQuantity}
            removeCartItem={removeCartItem}
            moveToWishlist={moveToWishlist}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
