'use client';

import { OrderType } from '@/types';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import OrderDetails from './OrderDetails';
import OrderItems from './OrderItems';

type Props = {
  show: boolean;
  orders: OrderType[] | null;
};

export default function Orders({ show, orders }: Props) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  if (!show) return null;

  return (
    <Box component="ul">
      {orders?.map((order) => {
        return (
          <Grid
            component="li"
            key={order.orderId}
            container
            spacing={3}
            sx={{ marginBottom: 4 }}>
            <OrderDetails
              show={!isBelowMedium}
              order={order}
              borderColor={colorPalette.border}
            />
            <OrderItems
              order={order}
              borderColor={colorPalette.border}
            />
          </Grid>
        );
      })}
    </Box>
  );
}
