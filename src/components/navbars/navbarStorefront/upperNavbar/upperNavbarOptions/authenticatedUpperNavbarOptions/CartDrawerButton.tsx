import { Box, Typography } from '@mui/material';
import UpperNavbarIconButton from '../../UpperNavbarIconButton';
import { ShoppingCart } from '@mui/icons-material';
import { selectCartCount } from '@/lib/redux/features/cart/cartSelectors';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

export default function CartDrawerButton() {
  const dispatch = useAppDispatch();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const cartCount = selectCartCount(cartItems);

  function toggleCartDrawer() {
    dispatch(setIsCartOpen(!isCartOpen));
  }

  return (
    <UpperNavbarIconButton onClick={toggleCartDrawer}>
      <Typography
        component="span"
        sx={{
          display: { xs: 'none', md: 'inline' },
          color: (theme) => theme.palette.custom.navbar.upper.text,
        }}>
        Cart
      </Typography>
      <ShoppingCart
        aria-label="Shopping cart"
        sx={{ color: (theme) => theme.palette.custom.navbar.upper.text, marginLeft: 1 }}
      />
      <Box
        sx={(theme) => ({
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'grid',
          placeContent: 'center',
          marginLeft: 1,
        })}>
        <Typography fontSize={12}>{cartCount}</Typography>
      </Box>
    </UpperNavbarIconButton>
  );
}
