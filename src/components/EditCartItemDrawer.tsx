'use client';

import { Box, Divider, IconButton, List, ListItemButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItemQuantity, setCartItemSize, setCartItemToEditId } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { Add, Check, Delete, Edit, FavoriteBorder, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from './ui/buttons/TextButton';
import updateCartItem from '@/services/cart/update-cart-item';
import { toast } from 'react-toastify';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';
import deleteItemFromCart from '@/services/cart/delete-item-from-cart';
import { useState } from 'react';

type Props = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const customColorPalette = useCustomColorPalette();
  const { cartItemToEditId } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const navbarHeight = isBelowMedium
    ? document.getElementById('navbar')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const mode = theme.palette.mode;
  const buttonLabelColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  function handleEditCartItem() {
    dispatch(setCartItemToEditId(cartItem?.cart_item_id));
  }

  async function handleSetCartItemSize(size: string) {
    dispatch(setCartItemSize({ id: cartItem?.cart_item_id!, size }));
    try {
      const { success, message } = await updateCartItem({
        cart_item_id: cartItem?.cart_item_id!,
        quantity: cartItem?.quantity!,
        size,
      });

      if (success === false) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Failed to update size. Please try again later.`);
    } finally {
      router.refresh();
    }
  }

  async function handleUpdateCartItemQuantity(quantity: number) {
    if (cartItem?.quantity === 1 && quantity === -1) return;
    dispatch(setCartItemQuantity({ id: cartItem?.cart_item_id!, quantity }));
    try {
      const { error } = await supabase.rpc('update', {
        item_id: cartItem?.cart_item_id,
        item_quantity: quantity,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(`Failed to update quantity. Please try again later.`);
    } finally {
      router.refresh();
    }
  }

  async function handleRemoveCartItem() {
    setIsRemovingCartItem(true);
    try {
      const { success, message } = await deleteItemFromCart(cartItem?.cart_item_id!);
      if (success === true) {
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Failed to remove product from cart. Please try again later.`);
    } finally {
      setIsRemovingCartItem(false);
    }
  }

  return (
    <>
      <IconButton onClick={handleEditCartItem}>
        <Edit
          fontSize="small"
          sx={{ opacity: '70%' }}
        />
      </IconButton>
      <DrawerComponent
        width={{ xs: '80vw', sm: '300px' }}
        isOpen={
          cartItemToEditId === cartItem?.cart_item_id
            ? {
                top: false,
                left: false,
                bottom: false,
                right: true,
              }
            : {
                top: false,
                left: false,
                bottom: false,
                right: false,
              }
        }
        zIndex={(theme) => theme.zIndex.appBar - 1}>
        <Box
          sx={{
            paddingTop: `${navbarHeight}px`,
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ padding: 2, paddingBottom: 1 }}>
              <Typography
                fontWeight={600}
                fontSize={24}>
                Select a size
              </Typography>
            </Box>
            <Divider />
            <List disablePadding>
              {cartItem?.product?.sizes.map((size) => (
                <Box key={size}>
                  <ListItemButton
                    onClick={() => handleSetCartItemSize(size)}
                    sx={{ height: '56px' }}>
                    {size === cartItem.size ? <Check sx={{ marginRight: 1 }} /> : null}
                    {/* {size === newSize && isUpdatingItemSize ? (
                      <Spinner
                        sx={{ marginRight: 1, color: 'inherit' }}
                        size={24}
                      />
                    ) : null} */}
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
              '&::before': {
                content: '""',
                position: 'absolute',
                boxShadow: '0 -2px 4px 0 rgba(0,0,0,0.15)',
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
                  onClick={() => handleUpdateCartItemQuantity(-1)}
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
                  onClick={() => handleUpdateCartItemQuantity(1)}
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
