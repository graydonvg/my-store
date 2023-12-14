'use client';

import { Box, Divider, List, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from '../ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Fragment } from 'react';
import CartItemSmall from '../CartItemSmall';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import { formatCurrency } from '@/lib/utils';
import { selectCartCount, selectOrderTotal, selectTotalDiscount } from '@/lib/redux/cart/cartSelectors';
import UpperNavIconButton from '../ui/buttons/upperNavIconButton';

export default function CartDrawer() {
  const router = useRouter();
  const customColorPalette = useCustomColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const navbarHeight = isBelowMedium
    ? document.getElementById('navbar')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const orderTotal = selectOrderTotal(cartItems);
  const cartCount = selectCartCount(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const mode = theme.palette.mode;
  const cartEmptyBgColor = mode === 'dark' ? customColorPalette.grey.dark : customColorPalette.grey.light;

  function handleToggleCart() {
    dispatch(setIsCartOpen({ ...isCartOpen, right: !isCartOpen.right }));
  }

  function handleGoToCartView() {
    handleToggleCart();
    router.push('/cart/view');
  }

  function handleGoToCheckout() {
    handleToggleCart();
    router.push('/checkout/shipping');
  }

  return (
    <>
      <UpperNavIconButton
        backgroundColor={customColorPalette.grey.dark}
        onClick={handleToggleCart}>
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
          <Typography fontSize={12}>{cartCount}</Typography>
        </Box>
      </UpperNavIconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '100vw', sm: '400px' }}
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
            overflowY: 'auto',
            paddingX: 2,
            height: 1,
          }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Fragment key={item?.cart_item_id}>
                <CartItemSmall item={item} />
                <Divider />
              </Fragment>
            ))
          ) : (
            <Box sx={{ backgroundColor: cartEmptyBgColor, padding: 1, marginTop: 2, borderRadius: '4px' }}>
              <Typography>Your cart is empty</Typography>
            </Box>
          )}
        </List>
        {cartItems.length > 0 ? (
          <Box
            sx={{
              position: 'relative',
              padding: 2,
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
                flexDirection: 'row',
                textTransform: 'uppercase',
                justifyContent: 'space-between',
                paddingBottom: 1,
              }}>
              <Typography
                component="span"
                fontSize={16}
                fontWeight={700}>
                Discount
              </Typography>
              <Typography
                component="span"
                fontSize={16}
                fontWeight={700}>
                {formatCurrency(totalDiscount)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingBottom: 2,
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
                {formatCurrency(orderTotal - totalDiscount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <OutlinedButton
                onClick={handleGoToCartView}
                fullWidth
                label="view cart"
              />
              <ContainedButton
                onClick={handleGoToCheckout}
                backgroundColor="blue"
                fullWidth
                label="checkout"
              />
            </Box>
          </Box>
        ) : null}
      </DrawerComponent>
    </>
  );
}
