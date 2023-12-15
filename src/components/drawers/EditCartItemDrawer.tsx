'use client';

import { Box, Divider, IconButton, List, ListItemButton, Typography, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from '../ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItemQuantity, setCartItemToEditId } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { Add, Check, Delete, Edit, FavoriteBorder, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from '../ui/buttons/TextButton';
import { toast } from 'react-toastify';
import deleteItemFromCart from '@/services/cart/delete-item-from-cart';
import { useEffect, useState } from 'react';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update-cart-item';
import { PulseLoader } from 'react-spinners';
import { selectQuantity } from '@/lib/redux/cart/cartSelectors';

const isDrawerOpen = {
  top: false,
  left: false,
  bottom: false,
  right: false,
};

type Props = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
  const [updateCartItemQuantityTimer, setUpdateCartItemQuantityTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const [isUpdatingCartItemQuantity, setIsUpdatingCartItemQuantity] = useState(false);
  const [isUpdatingCartItemSize, setIsUpdatingCartItemSize] = useState(false);
  const router = useRouter();
  const customColorPalette = useCustomColorPalette();
  const { cartItemToEditId } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const buttonLabelColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;
  const isUpdatingCartItem = isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize;

  useEffect(() => {
    setIsUpdatingCartItemSize(false);
  }, [cartItem?.size]);

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [cartItem]);

  function handleSetCartItemToEdit() {
    dispatch(setCartItemToEditId(cartItem?.cart_item_id));
  }

  async function handleUpdateCartItemSize(size: string) {
    if (size === cartItem?.size) return;
    setIsUpdatingCartItemSize(true);
    try {
      const { success, message } = await updateCartItemSize({
        cart_item_id: cartItem?.cart_item_id!,
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

  function handleSetCartItemQuantity(value: number) {
    if (cartItem?.quantity! === 1 && value === -1) return;
    dispatch(setCartItemQuantity({ id: cartItem?.cart_item_id!, value }));
    scheduleUpdateCartItemQuantityWithDelay(value);
  }

  function scheduleUpdateCartItemQuantityWithDelay(value: number) {
    if (updateCartItemQuantityTimer) {
      clearTimeout(updateCartItemQuantityTimer);
    }
    const newTimer = setTimeout(async () => {
      await handleUpdateCartItemQuantity(value);
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

  async function handleUpdateCartItemQuantity(value: number) {
    const newQuantity = cartItem?.quantity! + value;
    setIsUpdatingCartItemQuantity(true);
    try {
      const { success, message } = await updateCartItemQuantity({
        cart_item_id: cartItem?.cart_item_id!,
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
      const { success, message } = await deleteItemFromCart(cartItem?.cart_item_id!);
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
          sx={{ opacity: '70%' }}
        />
      </IconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '80vw', sm: '350px' }}
        isOpen={
          cartItemToEditId === cartItem?.cart_item_id
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
                color={buttonLabelColor}
                loading={isUpdatingCartItem}
                size={30}
              />
            </Box>
          ) : null}
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
                boxShadow: `0 -2px 4px 0 ${customColorPalette.boxShadow}`,
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
                  onClick={() => handleSetCartItemQuantity(-1)}
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
                  onClick={() => handleSetCartItemQuantity(1)}
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
              labelColor={buttonLabelColor}
              startIcon={<FavoriteBorder />}
            />
            <TextButton
              disabled={isRemovingCartItem}
              isLoading={isRemovingCartItem}
              onClick={handleRemoveCartItem}
              label={!isRemovingCartItem ? 'remove' : ''}
              labelColor={buttonLabelColor}
              startIcon={<Delete />}
            />
          </Box>
        </Box>
      </DrawerComponent>
    </>
  );
}
