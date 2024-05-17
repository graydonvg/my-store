import { Box, Divider, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import OutlinedButton from '../../ui/buttons/simple/OutlinedButton';
import { selectCartTotal, selectDiscountTotal } from '@/lib/redux/features/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import CheckoutButton from '../../ui/buttons/complex/CheckoutButton';

export default function FooterCartDrawer() {
  const router = useRouter();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const orderTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);

  function closeCartDrawer() {
    if (isCartOpen === true) {
      dispatch(setIsCartOpen(false));
    }
  }

  function navigateToCartView() {
    closeCartDrawer();
    router.push('/cart/view');
  }

  return (
    <Box>
      <Divider />
      <Box
        sx={{
          position: 'relative',
          padding: 2,
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
            onClick={navigateToCartView}
            fullWidth
            label="view cart"
          />
          <CheckoutButton
            fullWidth
            label="checkout"
          />
        </Box>
      </Box>
    </Box>
  );
}
