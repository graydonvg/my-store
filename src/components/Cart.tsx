'use client';

import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import Image from 'next/image';
import { Close } from '@mui/icons-material';
import deleteProductFromCart from '@/services/cart/delete-item-from-cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ContainedButton from './ui/buttons/ContainedButton';
import { useEffect, useState } from 'react';
import { Spinner } from './ui/progress/Spinner';

export default function Cart() {
  const [cartItemToDelete, setCartItemToDelete] = useState({ id: '' });
  const router = useRouter();
  const color = useCustomColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const upperNavbarHeight = isBelowMedium
    ? document.getElementById('upper-nav')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const cartCount = cartItems ? cartItems.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0) : 0;

  function handleToggleCart() {
    dispatch(setIsCartOpen({ ...isCartOpen, right: !isCartOpen.right }));
  }

  async function handleDeleteCartItem(cartItemId: string) {
    setCartItemToDelete({ id: cartItemId });
    try {
      const { success, message } = await deleteProductFromCart(cartItemId);
      if (success === false) {
        toast.error(message);
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error(`Failed to delete product from cart. Please try again later.`);
    }
  }

  useEffect(() => {
    setCartItemToDelete({ id: '' });
  }, [cartItems]);

  return (
    <>
      <Box
        component="button"
        onClick={handleToggleCart}
        sx={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          paddingX: { xs: 0, md: 2 },
          paddingY: 1,
        }}>
        <ShoppingCartIcon
          aria-label="Shopping cart"
          sx={{ color: color.grey.light }}
        />
        <Box
          sx={{
            color: color.grey.light,
            backgroundColor: color.blue.dark,
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'grid',
            placeContent: 'center',
            marginLeft: { xs: 1, md: 2 },
          }}>
          {cartCount}
        </Box>
      </Box>
      <DrawerComponent
        isOpen={isCartOpen}
        zIndex={(theme) => theme.zIndex.appBar - 1}>
        <Box
          sx={{
            paddingTop: `${upperNavbarHeight!}px`,
            paddingBottom: 2,
          }}
        />
        {/* <Box
          sx={{
            padding: 2,
            // backgroundColor: color.grey.dark,
          }}>
          <Typography
            component="h1"
            variant="h5">
            Cart
          </Typography>
        </Box> */}
        <Box
          sx={{
            width: { xs: '85vw', sm: '400px' },
            // paddingTop: 2,
            paddingX: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
            flexGrow: 1,
          }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box
                key={item?.cart_item_id}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  opacity: cartItemToDelete.id === item?.cart_item_id ? '70%' : null,
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    aspectRatio: 3 / 4,
                    flexGrow: 1,
                    minWidth: '30%',
                    maxWidth: '30%',
                  }}>
                  <Image
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    fill
                    sizes="(min-width: 600px) 110px, calc(25.36vw - 9px)"
                    src={item?.product?.product_image_data[0].image_url ?? ''}
                    alt={`Image of ${item?.product?.name}`}
                    priority
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flexGrow: 1,
                  }}>
                  <Typography>{item?.product?.name}</Typography>
                  <Typography>
                    {item?.product?.price! - item?.product?.price! * (item?.product?.sale_percentage! / 100)}
                  </Typography>
                  <Typography>{item?.size}</Typography>
                  <Typography>{item?.quantity}</Typography>
                </Box>
                <IconButton
                  disabled={cartItemToDelete.id === item?.cart_item_id}
                  onClick={() => handleDeleteCartItem(item?.cart_item_id!)}>
                  {cartItemToDelete.id === item?.cart_item_id ? (
                    <Spinner
                      size={20}
                      spinnerColor={mode === 'dark' ? color.grey.light : color.grey.dark}
                    />
                  ) : (
                    <Close sx={{ color: mode === 'dark' ? color.grey.light : color.grey.dark }} />
                  )}
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography>Your cart is empty</Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <ContainedButton
            variant="outlined"
            fullWidth
            label="go to cart"
          />
          <ContainedButton
            backgroundColor="blue"
            fullWidth
            label="checkout"
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
