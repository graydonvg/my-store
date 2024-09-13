'use client';

import { OrderData } from '@/types';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import OrderDetails from './orderDetails/OrderDetails';
import OrderItems from './orderItems/OrderItems';
import OutlinedButton from '../ui/buttons/simple/OutlinedButton';
import Link from 'next/link';

type Props = {
  orders: OrderData[];
  pageNumber: number;
  isEndOfData: boolean;
  lastPageNumber: number;
  maxOrdersPerPage: number;
  totalRowCount: number;
};

export default function OrdersPageStorefront({
  orders,
  pageNumber,
  isEndOfData,
  lastPageNumber,
  maxOrdersPerPage,
  totalRowCount,
}: Props) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
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
      {totalRowCount !== maxOrdersPerPage ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: { xs: 'center', sm: 'end' },
              alignItems: 'center',
              width: '100%',
            }}>
            {pageNumber > 1 ? (
              <Link
                href={`/orders?page=${pageNumber - 1}`}
                style={{ width: isBelowSmall ? '100%' : 'auto' }}>
                <OutlinedButton
                  label="Prev"
                  disabled={pageNumber < 2}
                  sxStyles={{ minHeight: '40px', width: { xs: '100%', sm: 136 } }}
                />
              </Link>
            ) : null}
            <Box
              component="ul"
              sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              {Array.from(Array(lastPageNumber)).map((_, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    fontSize: 20,
                    color: theme.palette.text.secondary,
                    ...(pageNumber === index + 1 && {
                      fontSize: 24,
                      color: theme.palette.text.primary,
                      fontWeight: 'bold',
                      lineHeight: '24px',
                    }),
                  }}>
                  <Link href={`/orders?page=${index + 1}`}>{index + 1}</Link>
                </Box>
              ))}
            </Box>
            {!isEndOfData ? (
              <Link
                href={`/orders?page=${pageNumber + 1}`}
                style={{ width: isBelowSmall ? '100%' : 'auto' }}>
                <OutlinedButton
                  label="Next"
                  disabled={isEndOfData}
                  sxStyles={{ minHeight: '40px', width: { xs: '100%', sm: 136 } }}
                />
              </Link>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </>
  );
}
