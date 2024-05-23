'use client';

import { OrderData } from '@/types';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import OrderDetails from './orderDetails/OrderDetails';
import OrderItems from './orderItems/OrderItems';

type Props = {
  orders: OrderData[];
};

export default function OrdersPageStorefront({ orders }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box component="ul">
      {orders.map((order) => {
        return (
          <Grid
            component="li"
            key={order.orderId}
            container
            spacing={3}
            sx={{ marginBottom: 4 }}>
            {!isBelowMedium ? (
              <Grid
                item
                xs={3}>
                <OrderDetails order={order} />
              </Grid>
            ) : null}
            <Grid
              item
              xs={12}
              md={9}>
              {isBelowMedium ? <OrderDetails order={order} /> : null}
              <OrderItems order={order} />
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
}
