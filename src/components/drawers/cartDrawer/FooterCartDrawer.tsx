import { Box, Divider, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import OutlinedButton from '../../ui/buttons/simple/OutlinedButton';
import { selectOrderTotal, selectRoundedDiscountTotal } from '@/lib/redux/features/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatting';
import CheckoutButton from '../../ui/buttons/complex/CheckoutButton';

export default function FooterCartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderTotal = useAppSelector(selectOrderTotal);
  const roundedDiscountTotal = useAppSelector(selectRoundedDiscountTotal);

  function navigateToCartView() {
    dispatch(setIsCartOpen(false));
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
        {roundedDiscountTotal > 0 ? (
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
              {formatCurrency(roundedDiscountTotal)}
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
            {formatCurrency(orderTotal)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <OutlinedButton
            onClick={navigateToCartView}
            fullWidth
            label="view cart"
            sxStyles={{ minWidth: 'fit-content', flex: 1 }}
          />
          <CheckoutButton
            fullWidth
            label="checkout"
            sxStyles={{ minWidth: 'fit-content', flex: 1 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
