import { Box, Toolbar, Typography, useTheme } from '@mui/material';
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
  const cartCount = selectCartCount(cartItems);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navbarHeight = document.getElementById('navbar')?.offsetHeight;

  function toggleCartDrawer() {
    dispatch(setIsCartOpen(!isCartOpen));
  }

  function closeCartDrawer() {
    dispatch(setIsCartOpen(false));
  }

  return (
    <>
      <UpperNavbarIconButton
        backgroundColor={colorPalette.navBar.upper.background}
        onClick={toggleCartDrawer}>
        <Typography
          component="span"
          sx={{ display: { xs: 'none', md: 'inline' }, color: colorPalette.typographyVariants.white }}>
          Cart
        </Typography>
        <ShoppingCartIcon
          aria-label="Shopping cart"
          sx={{ color: colorPalette.navBar.upper.text, marginLeft: 1 }}
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
            marginLeft: 1,
          }}>
          <Typography fontSize={12}>{cartCount}</Typography>
        </Box>
      </UpperNavbarIconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '90vw', sm: '400px' }}
        isOpen={{ right: isCartOpen }}
        zIndex={theme.zIndex.appBar - 1}
        closeDrawer={closeCartDrawer}>
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
