'use client';

import { Box, IconButton, useTheme } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from '../DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItemQuantity, setCartItemToEditId } from '@/lib/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { CartItemType } from '@/types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update';
import { PulseLoader } from 'react-spinners';
import { deleteItemFromCart } from '@/services/cart/delete';
import SizePickerEditCartItemDrawer from './SizePickerEditCartItemDrawer';
import FooterEditCartItemDrawer from './FooterEditCartItemDrawer';

type EditCartItemDrawerProps = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: EditCartItemDrawerProps) {
  const theme = useTheme();
  const [updateCartItemQuantityTimer, setUpdateCartItemQuantityTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const [isUpdatingCartItemQuantity, setIsUpdatingCartItemQuantity] = useState(false);
  const [isUpdatingCartItemSize, setIsUpdatingCartItemSize] = useState(false);
  const router = useRouter();
  const colorPalette = useColorPalette();
  const { cartItems } = useAppSelector((state) => state.cart);
  // const { cartItemToEditId, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const isUpdatingCartItem = isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize;
  const [cartItemToEditId, setCartItemToEditId] = useState<string | null>(null);

  useEffect(() => {
    setIsUpdatingCartItemSize(false);
  }, [cartItem?.size]);

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [cartItem]);

  function handleSetCartItemToEdit(id: string | null) {
    console.log(id === cartItem?.cartItemId);

    setCartItemToEditId(id);
  }

  async function handleUpdateCartItemSize(size: string) {
    // If an item with the selected size already exists, update the quantity of that item appropriately and remove the old item. Else, update the size.

    if (size === cartItem?.size) return;

    setIsUpdatingCartItemSize(true);

    const itemOfSelectedSizeExists = cartItems.find(
      (item) =>
        item?.product?.productId === cartItem?.product?.productId &&
        item?.size === size &&
        item.cartItemId !== cartItem?.cartItemId
    );

    if (itemOfSelectedSizeExists) {
      await handleUpdateCartItemQuantity(
        itemOfSelectedSizeExists.cartItemId,
        itemOfSelectedSizeExists.quantity,
        cartItem?.quantity!
      );

      await handleRemoveCartItem();
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

  function handleSetCartItemQuantity(cartItemId: string, value: number) {
    if (cartItem?.quantity! === 1 && value === -1) return;
    dispatch(setCartItemQuantity({ id: cartItemId, value }));
    scheduleUpdateCartItemQuantityWithDelay(cartItemId, value);
  }

  function scheduleUpdateCartItemQuantityWithDelay(cartItemId: string, value: number) {
    // Add a delay before updating the quantity in case the use presses the button multiple times.
    if (updateCartItemQuantityTimer) {
      clearTimeout(updateCartItemQuantityTimer);
    }
    const newTimer = setTimeout(async () => {
      await handleUpdateCartItemQuantity(cartItemId, cartItem?.quantity!, value);
    }, 1000);
    setUpdateCartItemQuantityTimer(newTimer);
  }

  useEffect(() => {
    return () => {
      if (updateCartItemQuantityTimer) {
        clearTimeout(updateCartItemQuantityTimer);
      }
    };
  }, [updateCartItemQuantityTimer]);

  async function handleUpdateCartItemQuantity(cartItemId: string, previousQuantity: number, quantityToAdd: number) {
    const newQuantity = previousQuantity + quantityToAdd;

    setIsUpdatingCartItemQuantity(true);

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

  async function handleRemoveCartItem() {
    setIsRemovingCartItem(true);

    const { success, message } = await deleteItemFromCart(cartItem?.cartItemId!);

    if (success === true) {
      router.refresh();
    } else {
      setIsRemovingCartItem(false);
      toast.error(message);
    }
  }

  return (
    <>
      <IconButton onClick={() => handleSetCartItemToEdit(cartItem?.cartItemId)}>
        <Edit
          fontSize="small"
          sx={{ color: colorPalette.typographyVariants.grey }}
        />
      </IconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '80vw', sm: '350px' }}
        isOpen={{
          right: cartItemToEditId === cartItem?.cartItemId,
        }}
        zIndex={theme.zIndex.appBar + 1}
        closeDrawer={() => handleSetCartItemToEdit(null)}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          {isUpdatingCartItem ? (
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                height: 1,
                width: 1,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: (theme) => theme.zIndex.appBar + 2,
                backgroundColor: 'transparent',
              }}>
              <PulseLoader
                color={colorPalette.typography}
                loading={isUpdatingCartItem}
                size={30}
              />
            </Box>
          ) : null}
          <SizePickerEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            setCartItemSizeOnClick={handleUpdateCartItemSize}
          />
          <FooterEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            isRemovingCartItem={isRemovingCartItem}
            setCartItemQuantityOnClick={handleSetCartItemQuantity}
            removeCartItemOnClick={handleRemoveCartItem}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
