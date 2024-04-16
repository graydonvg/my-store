'use client';

import { CustomerOrderType } from '@/types';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import OrderDetails from './orderDetails/OrderDetails';
import OrderItems from './orderItems/OrderItems';

type Props = {
  orders: CustomerOrderType[] | null;
};

export default function OrdersPageClient({ orders }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box component="ul">
      {orders && orders.length > 0
        ? orders?.map((order) => {
            return (
              <Grid
                component="li"
                key={order.orderId}
                container
                spacing={3}
                sx={{ marginBottom: 4 }}>
                {!isBelowMedium ? (
                  <OrderDetails
                    order={order}
                    borderColor={theme.palette.custom.border}
                  />
                ) : null}
                <OrderItems
                  order={order}
                  borderColor={theme.palette.custom.border}
                />
              </Grid>
            );
          })
        : null}
    </Box>
  );
}
