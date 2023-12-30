'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import ContainedButton from '../ui/buttons/ContainedButton';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import { formatCurrency } from '@/lib/utils';
import { selectCartCount, selectOrderTotal, selectTotalDiscount } from '@/lib/redux/cart/cartSelectors';
import UpperNavIconButton from '../ui/buttons/upperNavIconButton';
import SmallCartItemList from '../cartItems/SmallCartItemList';

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

  function handleToggleCart() {
    dispatch(setIsCartOpen({ ...isCartOpen, right: !isCartOpen.right }));
  }

  function handleCloseCartDrawer() {
    if (isCartOpen.right === true) {
      dispatch(setIsCartOpen({ ...isCartOpen, right: false }));
    }
  }

  function handleGoToCartView() {
    handleCloseCartDrawer();
    router.push('/cart/view');
  }

  function handleGoToCheckout() {
    handleCloseCartDrawer();
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
        <SmallCartItemList />
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
