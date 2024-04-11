import { CustomerOrderType } from '@/types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from '../orderTotals/OrderTotals';
import { BORDER_RADIUS } from '@/config';
import OrderShippingDetails from './OrderShippingDetails';

type Props = {
  order: CustomerOrderType;
  borderColor: string;
};

export default function OrderDetails({ order, borderColor }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const shippingDetails = { ...order.shippingDetails[0] };

  return (
    <Grid
      item
      xs={0}
      md={3}>
      <Box
        sx={{
          border: `1px solid ${borderColor}`,
          padding: 2,
          borderRadius: isBelowMedium ? 'none' : BORDER_RADIUS,
          borderTopLeftRadius: BORDER_RADIUS,
          borderTopRightRadius: BORDER_RADIUS,
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                Order Status:
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {order.isPaid === true ? 'Paid' : 'Payment pending'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}>
                Order Date:
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {order.createdAt.split('T')[0]}
              </Typography>
            </Box>
          </Box>
          <OrderShippingDetails shippingDetails={shippingDetails} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              component="h3"
              fontSize={18}
              fontWeight={600}>
              Order Summary
            </Typography>
            <OrderTotals
              cartTotal={order.cartTotal}
              discountTotal={order.discountTotal}
              deliveryFee={order.deliveryFee}
              orderTotal={order.orderTotal}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
