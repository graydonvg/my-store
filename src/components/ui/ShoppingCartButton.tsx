import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import DrawerComponent from './DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

export default function ShoppingCartButton() {
  const color = useCustomColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const upperNavbarHeight = isBelowMedium
    ? document.getElementById('upper-nav')?.offsetHeight
    : document.getElementById('navbar')?.offsetHeight;
  const cartCount = cartItems.reduce((totalCount, item) => totalCount + item.quantity, 0);

  function handleToggleCart() {
    dispatch(setIsCartOpen({ ...isCartOpen, right: !isCartOpen.right }));
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
        <Box sx={{ paddingTop: `${upperNavbarHeight! + 10}px`, width: '250px' }}>
          {cartItems.map((item) => (
            <Box
              key={item.productId}
              sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>{item.name}</Typography>
              <Typography>{item.price}</Typography>
              <Typography>{item.salePrice}</Typography>
              <Typography>{item.quantity}</Typography>
              <Typography>{item.priceByQuantity}</Typography>
              <Typography>{item.salePriceByQuantity}</Typography>
              <Typography>{item.size}</Typography>
            </Box>
          ))}
        </Box>
      </DrawerComponent>
    </>
  );
}
