import { OrderType } from '@/types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from './OrderTotals';
import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type Props = {
  show: boolean;
  order: OrderType;
  borderColor: string;
};

export default function OrderDetails({ show, order, borderColor }: Props) {
  const shippingData = Object.values(order.shipping_details[0]);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  if (!show) return null;

  return (
    <Grid
      item
      xs={0}
      md={3}>
      <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: isBelowMedium ? 'none' : borderRadius, padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Typography
              component="span"
              fontSize={14}
              fontWeight={600}
              sx={{ opacity: '70%' }}>
              Order Date:
            </Typography>
            <Typography
              component="span"
              fontSize={14}>
              {order.created_at.split('T')[0]}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Typography
              component="h4"
              fontSize={14}
              fontWeight={500}
              textTransform="uppercase"
              sx={{ opacity: '70%' }}>
              Shipping Details:
            </Typography>
            <Box>
              {shippingData.map((value) => (
                <Typography
                  key={value}
                  component="h3"
                  fontSize={14}>
                  {value}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography
              component="h3"
              fontSize={18}
              fontWeight={600}
              sx={{ opacity: '70%' }}>
              Order Summary
            </Typography>
            <OrderTotals
              cartTotal={order.cart_total}
              totalDiscount={order.discount_total}
              deliveryFee={order.delivery_fee}
              orderTotal={order.order_total}
            />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
