import { OrderData } from '@/types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from '../orderTotals/OrderTotals';
import { BORDER_RADIUS } from '@/data';
import OrderShippingDetails from './OrderShippingDetails';
import dayjs from 'dayjs';
import ContainedButton from '@/components/ui/buttons/simple/ContainedButton';
import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';
import { Payment } from '@mui/icons-material';

type Props = {
  order: OrderData;
  borderColor: string;
};

export default function OrderDetails({ order, borderColor }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid
      item
      xs={0}
      md={4}>
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
              <Box sx={{ minWidth: 'fit-content' }}>
                <Typography
                  component="span"
                  fontSize={14}
                  fontWeight={600}
                  noWrap
                  sx={{ color: theme.palette.text.secondary }}>
                  Order Status:
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="span"
                  fontSize={14}
                  sx={{ textTransform: 'capitalize' }}>
                  {order.orderStatus}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={600}
                sx={{ color: theme.palette.text.secondary }}>
                Order Date:
              </Typography>
              <Typography
                component="span"
                fontSize={14}>
                {dayjs(order?.createdAt).format('YYYY-MM-DD')}
              </Typography>
            </Box>
          </Box>
          {order.shippingDetails ? <OrderShippingDetails shippingDetails={order.shippingDetails} /> : null}
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
        {order.orderStatus === 'awaiting payment' &&
        order.pendingCheckoutSessionId &&
        order.pendingCheckoutSessionId.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, paddingTop: 2 }}>
            <OutlinedButton
              label="cancel"
              sxStyles={{ minWidth: 'fit-content', flex: 1 }}
            />
            <ContainedButton
              label="pay now"
              color="secondary"
              sxStyles={{ minWidth: 'fit-content', flex: 1 }}
              startIcon={<Payment />}
            />
          </Box>
        ) : null}
      </Box>
    </Grid>
  );
}
