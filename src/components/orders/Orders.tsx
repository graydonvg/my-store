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
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  if (!show) return null;

  return (
    <>
      {orders?.map((order) => {
        return (
          <Grid
            key={order.order_id}
            container
            spacing={3}
            sx={{ marginBottom: 4 }}>
            <OrderDetails
              show={!isBelowMedium}
              order={order}
              borderColor={borderColor}
            />
            <OrderItems
              // show={order.order_items.length > 0}
              order={order}
              borderColor={borderColor}
            />
          </Grid>
        );
      })}
    </>
  );
}
