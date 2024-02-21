'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from '../DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import { selectCartCount } from '@/lib/redux/selectors/cartSelectors';
import SmallCartItemList from '../../cartItems/smallCartItemList/SmallCartItemList';
import FooterCartDrawer from './FooterCartDrawer';
import UpperNavbarIconButton from '@/components/navbars/upperNavbar/UpperNavbarIconButton';

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
      <UpperNavbarIconButton
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
      </UpperNavbarIconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '90vw', sm: '400px' }}
        isOpen={isCartOpen}
        zIndex={(theme) => theme.zIndex.appBar - 1}>
        <Box
          sx={{
            paddingTop: `${navbarHeight}px`,
          }}
        />
        <SmallCartItemList paddingX={2} />
        {cartItems.length > 0 ? <FooterCartDrawer /> : null}
      </DrawerComponent>
    </>
  );
}
