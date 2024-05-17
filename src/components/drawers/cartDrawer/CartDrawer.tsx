import { Box, Toolbar, Typography, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DrawerComponent from '../DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import { selectCartCount } from '@/lib/redux/features/cart/cartSelectors';
import SmallCartItemList from '../../cartItems/smallCartItemList/SmallCartItemList';
import FooterCartDrawer from './FooterCartDrawer';
import UpperNavbarIconButton from '@/components/navbars/navbarStorefront/upperNavbar/UpperNavbarIconButton';

export default function CartDrawer() {
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const cartCount = selectCartCount(cartItems);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  function toggleCartDrawer() {
    dispatch(setIsCartOpen(!isCartOpen));
  }

  function closeCartDrawer() {
    dispatch(setIsCartOpen(false));
  }

  return (
    <>
      <UpperNavbarIconButton
        backgroundColor={theme.palette.custom.navbar.upper.background}
        onClick={toggleCartDrawer}>
        <Typography
          component="span"
          sx={{
            display: { xs: 'none', md: 'inline' },
            color: theme.palette.custom.navbar.upper.text,
          }}>
          Cart
        </Typography>
        <ShoppingCartIcon
          aria-label="Shopping cart"
          sx={{ color: theme.palette.custom.navbar.upper.text, marginLeft: 1 }}
        />
        <Box
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
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
        isOpen={{ right: isCartOpen }}
        closeDrawer={closeCartDrawer}
        drawerProps={{ sx: { zIndex: theme.zIndex.appBar - 1 } }}
        paperProps={{
          sx: {
            width: { xs: '90vw', sm: '400px' },
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
          },
        }}>
        <Toolbar
          sx={{
            minHeight: { xs: '64px !important', md: '96px !important' },
          }}
        />
        <SmallCartItemList paddingX={2} />
        {cartItems.length > 0 ? <FooterCartDrawer /> : null}
      </DrawerComponent>
    </>
  );
}
