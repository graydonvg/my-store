'use client';

import { OrderData } from '@/types';
import { Box, Grid2, useMediaQuery, useTheme } from '@mui/material';
import OrderDetails from './orderDetails/OrderDetails';
import OrderItems from './orderItems/OrderItems';
import PaginationButtons from './PaginationButtons';

type Props = {
  orders: OrderData[];
  pageNumber: number;
  maxOrdersPerPage: number;
  totalRowCount: number;
};

export default function OrdersPageStorefront({ orders, pageNumber, maxOrdersPerPage, totalRowCount }: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Box component="ul">
        {orders.map((order) => {
          return (
            <Grid2
              component="li"
              key={order.orderId}
              container
              spacing={3}
              sx={{ marginBottom: 4 }}>
              {!isBelowMedium ? (
                <Grid2 size={{ xs: 3 }}>
                  <OrderDetails order={order} />
                </Grid2>
              ) : null}
              <Grid2 size={{ xs: 12, md: 9 }}>
                {isBelowMedium ? <OrderDetails order={order} /> : null}
                <OrderItems order={order} />
              </Grid2>
            </Grid2>
          );
        })}
      </Box>
      {totalRowCount > maxOrdersPerPage ? (
        <PaginationButtons
          orders={orders}
          pageNumber={pageNumber}
          maxOrdersPerPage={maxOrdersPerPage}
          totalRowCount={totalRowCount}
        />
      ) : null}
    </>
  );
}
