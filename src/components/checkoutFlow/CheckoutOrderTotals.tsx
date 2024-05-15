import { Box, Grid, Paper, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectDiscountTotal,
  selectOrderTotal,
} from '@/lib/redux/selectors/cartSelectors';
import { BORDER_RADIUS } from '@/data';
import OrderTotals from '@/components/ordersPageStorefront/orderTotals/OrderTotals';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import PaymentButton from '@/components/ui/buttons/PaymentButton';

export default function CheckoutOrderTotals() {
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);
  const isCartView = pathname.includes('/cart/view');
  const isShippingView = pathname.includes('/checkout/shipping');

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
        {isCartView ? (
          <CheckoutButton
            disabled={cartItems.length === 0}
            label="checkout now"
            fullWidth
          />
        ) : null}

        {isShippingView ? <PaymentButton buttonVariant="contained" /> : null}
      </Paper>
    </Grid>
  );
}