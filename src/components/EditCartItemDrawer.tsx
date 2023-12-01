'use client';

import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCartItemToDelete, setCartItemToEditId, setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import ContainedButton from './ui/buttons/ContainedButton';
import { Fragment, useEffect, useState } from 'react';
import CartItemSmall from './CartItemSmall';
import OutlinedButton from './ui/buttons/OutlinedButton';
import { formatCurrency } from '@/lib/utils';
import { selectCartCount, selectCartTotal, selectTotalDiscount } from '@/lib/redux/cart/cartSelectors';
import { Add, Check, Delete, Edit, Favorite, FavoriteBorder, FavoriteOutlined, Remove } from '@mui/icons-material';
import { CartItemType } from '@/types';
import TextButton from './ui/buttons/TextButton';

type Props = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
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
    console.log(cartItem?.cart_item_id);
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
            width: { xs: '85vw', sm: '400px' },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ padding: 2 }}>
              <Typography
                fontWeight={600}
                fontSize={18}>
                Select a size
              </Typography>
            </Box>
            <Divider />
            <List disablePadding>
              {cartItem?.product?.sizes.map((size) => (
                <Fragment key={size}>
                  <ListItemButton>
                    {size === cartItem.size ? <Check sx={{ marginRight: 1 }} /> : null}
                    <Typography>{size}</Typography>
                  </ListItemButton>
                  <Divider />
                </Fragment>
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
                  // onClick={handleDecrementItemQuantity}
                  sx={{
                    color: 'inherit',
                    height: '48px',
                    aspectRatio: 3 / 2,
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
                  sx={{ width: '4ch', textAlign: 'center' }}>
                  {cartItem?.quantity}
                </Typography>
                <IconButton
                  // onClick={handleIncrementItemQuantity}
                  sx={{
                    color: 'inherit',
                    height: '48px',
                    aspectRatio: 3 / 2,
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
              label="remove"
              labelColor={buttonLabelColor}
              startIcon={<Delete />}
            />
          </Box>
        </Box>
      </DrawerComponent>
    </>
  );
}
