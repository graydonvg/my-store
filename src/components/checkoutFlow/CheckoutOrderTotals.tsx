import { Box, Grid, Paper, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectDiscountTotal,
  selectOrderTotal,
  selectCartItems,
} from '@/lib/redux/features/cart/cartSelectors';
import { BORDER_RADIUS } from '@/data';
import OrderTotals from '@/components/ordersPageStorefront/orderTotals/OrderTotals';
import CheckoutButton from '@/components/ui/buttons/complex/CheckoutButton';
import PaymentButton from '@/components/checkoutFlow/PaymentButton';

export default function CheckoutOrderTotals() {
  const pathname = usePathname();
  const cartItems = useAppSelector(selectCartItems);
  const discountTotal = useAppSelector(selectDiscountTotal);
  const cartTotal = useAppSelector(selectCartTotal);
  const deliveryFee = useAppSelector(selectDeliveryFee);
  const orderTotal = useAppSelector(selectOrderTotal);
  const isCartViewPath = pathname.startsWith('/cart/view');
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return (
    <Grid
      item
      xs={12}
      md={3}>
      <Paper
        sx={{
          paddingX: 3,
          paddingY: 4,
          borderRadius: BORDER_RADIUS,
          minWidth: 'fit-content',
        }}>
        <Typography
          component="h1"
          fontFamily="Source Sans Pro,sans-serif"
          fontSize={30}
          lineHeight={1}>
          Your Order
        </Typography>
        <Box sx={{ paddingY: 2 }}>
          <OrderTotals
            cartTotal={cartTotal}
            discountTotal={discountTotal}
            deliveryFee={deliveryFee}
            orderTotal={orderTotal}
            totalToPay={orderTotal}
          />
        </Box>
        {isCartViewPath ? (
          <CheckoutButton
            disabled={cartItems.length === 0}
            label="checkout now"
            fullWidth
          />
        ) : null}

        {isShippingPath ? <PaymentButton /> : null}
      </Paper>
    </Grid>
  );
}
