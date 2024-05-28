import { OrderData } from '@/types';
import { Box, Typography } from '@mui/material';
import OrderTotals from '../orderTotals/OrderTotals';
import { CONSTANTS } from '@/constants';
import OrderShippingDetails from './OrderShippingDetails';
import dayjs from 'dayjs';
import PayNowButton from './PayNowButton';
import CancelOrderButton from './CancelOrderButton';

type Props = {
  order: OrderData;
};

export default function OrderDetails({ order }: Props) {
  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.custom.border}`,
        padding: 2,
        borderRadius: { xs: 'none', md: CONSTANTS.BORDER_RADIUS },
        borderTopLeftRadius: CONSTANTS.BORDER_RADIUS,
        borderTopRightRadius: CONSTANTS.BORDER_RADIUS,
      })}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          {[
            { label: 'Order no:', value: order.orderId },
            { label: 'Order Status:', value: order.orderStatus },
            { label: 'Order Date:', value: dayjs(order?.createdAt).format('YYYY-MM-DD') },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <Box sx={{ minWidth: 'fit-content' }}>
                <Typography
                  component="span"
                  fontSize={14}
                  fontWeight={600}
                  noWrap
                  sx={{ color: (theme) => theme.palette.text.secondary }}>
                  {item.label}
                </Typography>
              </Box>
              <Box>
                <Typography
                  component="span"
                  fontSize={14}
                  sx={{ textTransform: 'capitalize' }}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
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
      {order.orderStatus === 'awaiting payment' ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, paddingTop: 2 }}>
          <CancelOrderButton orderId={order.orderId} />
          <PayNowButton
            order={order}
            sessionId={order.pendingCheckoutSessionId}
          />
        </Box>
      ) : null}
    </Box>
  );
}
