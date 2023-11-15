'use client';

import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import Image from 'next/image';
import { Close } from '@mui/icons-material';
import deleteProductFromCart from '@/services/cart/delete-item-from-cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const router = useRouter();
  const color = useCustomColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const upperNavbarHeight = isBelowMedium
    ? document.getElementById('upper-nav')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const cartCount = cartItems ? cartItems.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0) : 0;

  function handleToggleCart() {
    dispatch(setIsCartOpen({ ...isCartOpen, right: !isCartOpen.right }));
  }

  async function handleDeleteCartItem(cartItemId: string) {
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
            paddingTop: `${upperNavbarHeight! + 10}px`,
            width: { xs: '100vw', sm: '400px' },
            paddingX: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
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
                <IconButton onClick={() => handleDeleteCartItem(item?.cart_item_id!)}>
                  <Close />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography>Your cart is empty</Typography>
          )}
        </Box>
      </DrawerComponent>
    </>
  );
}
