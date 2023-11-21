'use client';

import { Box, Divider, List, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import deleteProductFromCart from '@/services/cart/delete-item-from-cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ContainedButton from './ui/buttons/ContainedButton';
import { Fragment, useEffect, useState } from 'react';
import CartItem from './CartItem';
import OutlinedButton from './ui/buttons/OutlinedButton';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const [cartItemToDelete, setCartItemToDelete] = useState({ id: '' });
  const router = useRouter();
  const customColorPalette = useCustomColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const navbarHeight = isBelowMedium
    ? document.getElementById('navbar')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const cartCount = cartItems ? cartItems.reduce((totalCount, item) => totalCount + (item ? item?.quantity : 0), 0) : 0;
  const cartTotal = cartItems.reduce(
    (totalPrice, item) =>
      totalPrice +
      (item?.product?.on_sale
        ? item?.product?.price! -
          (item?.product?.price! as number) * ((item?.product?.sale_percentage! as number) / 100)
        : item?.product?.price!),
    0
  );

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
          sx={{ color: customColorPalette.grey.light }}
        />
        <Box
          sx={{
            color: customColorPalette.grey.light,
            backgroundColor: customColorPalette.blue.dark,
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
            paddingTop: `${navbarHeight}px`,
          }}
        />
        <List
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100vw', sm: '400px' },
            overflowY: 'auto',
            paddingX: 2,
            height: 1,
          }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Fragment key={item?.cart_item_id}>
                <CartItem
                  item={item}
                  cartItemToDelete={cartItemToDelete}
                  deleteCartItem={() => handleDeleteCartItem(item?.cart_item_id!)}
                />
                <Divider />
              </Fragment>
            ))
          ) : (
            <Typography>Your cart is empty</Typography>
          )}
        </List>
        {cartItems.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: 2,
                textTransform: 'uppercase',
              }}>
              <Typography
                component="span"
                fontSize={24}
                fontWeight={700}>
                total
              </Typography>
              <Typography
                component="span"
                fontSize={24}
                fontWeight={700}>
                {formatCurrency(cartTotal)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, paddingX: 2, paddingBottom: 2 }}>
              <OutlinedButton
                fullWidth
                label="view cart"
              />
              <ContainedButton
                backgroundColor="blue"
                fullWidth
                label="checkout"
              />
            </Box>{' '}
          </>
        ) : null}
      </DrawerComponent>
    </>
  );
}
