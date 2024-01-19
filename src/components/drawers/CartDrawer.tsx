'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from './DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';
import { useRouter } from 'next/navigation';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import { selectCartCount, selectCartTotal, selectDiscountTotal } from '@/lib/redux/cart/cartSelectors';
import UpperNavIconButton from '../ui/buttons/upperNavIconButton';
import SmallCartItemList from '../cartItems/SmallCartItemList';
import { formatCurrency } from '@/utils/formatCurrency';
import CheckoutButton from '../ui/buttons/CheckoutButton';

type DrawerFooterProps = {
  show: boolean;
};

function CartFooter({ show }: DrawerFooterProps) {
  const router = useRouter();
  const colorPalette = useColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const orderTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);

  if (!show) return null;

  function handleCloseCartDrawer() {
    if (isCartOpen.right === true) {
      dispatch(setIsCartOpen(false));
    }
  }

  function handleGoToCartView() {
    handleCloseCartDrawer();
    router.push('/cart/view');
  }

  return (
    <Box
      sx={{
        position: 'relative',
        padding: 2,
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
      {discountTotal > 0 ? (
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
            {formatCurrency(discountTotal)}
          </Typography>
        </Box>
      ) : null}
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
          {formatCurrency(orderTotal - discountTotal)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <OutlinedButton
          onClick={handleGoToCartView}
          fullWidth
          label="view cart"
        />
        <CheckoutButton
          backgroundColor="blue"
          fullWidth
          label="checkout"
        />
      </Box>
    </Box>
  );
}

export default function CartDrawer() {
  const colorPalette = useColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const navbarHeight = isBelowMedium
    ? document.getElementById('navbar')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const cartCount = selectCartCount(cartItems);

  function handleToggleCart() {
    dispatch(setIsCartOpen(!isCartOpen.right));
  }

  return (
    <>
      <UpperNavIconButton
        backgroundColor={colorPalette.navBar.upper.background}
        onClick={handleToggleCart}>
        <ShoppingCartIcon
          aria-label="Shopping cart"
          sx={{ color: colorPalette.navBar.upper.text }}
        />
        <Box
          sx={{
            color: colorPalette.navBar.upper.text,
            backgroundColor: colorPalette.primary.dark,
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
        <SmallCartItemList paddingX={2} />
        <CartFooter show={cartItems.length > 0} />
      </DrawerComponent>
    </>
  );
}
