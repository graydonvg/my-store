'use client';

import { OrderType } from '@/types';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import OrderDetails from './OrderDetails';
import OrderItems from './OrderItems';

type Props = {
  show: boolean;
  orders: OrderType[];
};

export default function Orders({ show, orders }: Props) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  if (!show) return null;

  return (
    <>
      {orders?.map((order) => {
        return (
          <Grid
            key={order.orderId}
            container
            spacing={3}
            sx={{ marginBottom: 4 }}>
            <OrderDetails
              show={!isBelowMedium}
              order={order}
              borderColor={customColorPalette.border}
            />
            <OrderItems
              order={order}
              borderColor={customColorPalette.border}
            />
          </Grid>
        );
      })}
    </>
  );
}
