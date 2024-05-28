import { Box, Typography } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectRoundedDiscountTotal,
  selectOrderTotal,
} from '@/lib/redux/features/cart/cartSelectors';
import OrderTotals from '@/components/ordersPageStorefront/orderTotals/OrderTotals';

export default function CheckoutOrderTotals() {
  const roundedDiscountTotal = useAppSelector(selectRoundedDiscountTotal);
  const cartTotal = useAppSelector(selectCartTotal);
  const deliveryFee = useAppSelector(selectDeliveryFee);
  const orderTotal = useAppSelector(selectOrderTotal);

  return (
    <>
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
          discountTotal={roundedDiscountTotal}
          deliveryFee={deliveryFee}
          orderTotal={orderTotal}
          totalToPay={orderTotal}
        />
      </Box>
    </>
  );
}
