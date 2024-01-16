'use client';

import { Box, Divider, IconButton, List, ListItemButton, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from './DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItemQuantity, setCartItemToEditId } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { Add, Check, Delete, Edit, FavoriteBorder, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from '../ui/buttons/TextButton';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update';
import { PulseLoader } from 'react-spinners';
import { deleteItemFromCart } from '@/services/cart/delete';

type LoaderProps = {
  show: boolean;
  buttonLabelColor: string;
};

function Loader({ show, buttonLabelColor }: LoaderProps) {
  if (!show) return null;

  return (
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
        color={buttonLabelColor}
        loading={show}
        size={30}
      />
    </Box>
  );
}

const isDrawerOpen = {
  top: false,
  left: false,
  bottom: false,
  right: false,
};

type EditCartItemDrawerProps = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: EditCartItemDrawerProps) {
  const [updateCartItemQuantityTimer, setUpdateCartItemQuantityTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const [isUpdatingCartItemQuantity, setIsUpdatingCartItemQuantity] = useState(false);
  const [isUpdatingCartItemSize, setIsUpdatingCartItemSize] = useState(false);
  const router = useRouter();
  const colorPalette = useColorPalette();
  const { cartItemToEditId, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const isUpdatingCartItem = isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize;

  useEffect(() => {
    setIsUpdatingCartItemSize(false);
  }, [cartItem?.size]);

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [cartItem]);

  function handleSetCartItemToEdit() {
    dispatch(setCartItemToEditId(cartItem?.cartItemId));
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
      try {
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
      } catch (error) {
        setIsUpdatingCartItemSize(false);
        toast.error(`Failed to update size. Please try again later.`);
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
    try {
      const { success, message } = await updateCartItemQuantity({
        cartItemId: cartItemId,
        quantity: newQuantity,
      });
      if (success === false) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Failed to update quantity. Please try again later.`);
    } finally {
      router.refresh();
      setIsUpdatingCartItemQuantity(false);
    }
  }

  async function handleRemoveCartItem() {
    setIsRemovingCartItem(true);
    try {
      const { success, message } = await deleteItemFromCart(cartItem?.cartItemId!);
      if (success === true) {
        router.refresh();
      } else {
        setIsRemovingCartItem(false);
        toast.error(message);
      }
    } catch (error) {
      setIsRemovingCartItem(false);
      toast.error(`Failed to remove product from cart. Please try again later.`);
    }
  }

  return (
    <>
      <IconButton onClick={handleSetCartItemToEdit}>
        <Edit
          fontSize="small"
          sx={{ color: colorPalette.typographyVariants.grey }}
        />
      </IconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '80vw', sm: '350px' }}
        isOpen={
          cartItemToEditId === cartItem?.cartItemId
            ? {
                ...isDrawerOpen,
                right: true,
              }
            : isDrawerOpen
        }
        zIndex={(theme) => theme.zIndex.appBar + 1}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Loader
            show={isUpdatingCartItem}
            buttonLabelColor={colorPalette.typography}
          />
          <Box>
            <Box sx={{ padding: 2, paddingBottom: 1, opacity: isUpdatingCartItem ? 0.5 : 1 }}>
              <Typography
                fontWeight={600}
                fontSize={24}>
                Select a size
              </Typography>
            </Box>
            <Divider />
            <List
              disablePadding
              sx={{ opacity: isUpdatingCartItem ? 0.5 : 1 }}>
              {cartItem?.product?.sizes.map((size) => (
                <Box key={size}>
                  <ListItemButton
                    onClick={() => handleUpdateCartItemSize(size)}
                    sx={{ height: '56px' }}>
                    {size === cartItem.size ? <Check sx={{ marginRight: 1 }} /> : null}
                    <Typography>{size}</Typography>
                  </ListItemButton>
                  <Divider />
                </Box>
              ))}
            </List>
          </Box>
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
                  onClick={() => handleSetCartItemQuantity(cartItem?.cartItemId!, -1)}
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
                  onClick={() => handleSetCartItemQuantity(cartItem?.cartItemId!, 1)}
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
            <TextButton
              label="move to wishlist"
              labelColor={colorPalette.typography}
              startIcon={<FavoriteBorder />}
            />
            <TextButton
              disabled={isRemovingCartItem}
              isLoading={isRemovingCartItem}
              onClick={handleRemoveCartItem}
              label={!isRemovingCartItem ? 'remove' : ''}
              labelColor={colorPalette.typography}
              startIcon={<Delete />}
            />
          </Box>
        </Box>
      </DrawerComponent>
    </>
  );
}
