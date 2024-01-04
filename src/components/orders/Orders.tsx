'use client';

import { OrderType } from '@/types';
import { Box, Divider, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from './OrderTotals';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';
import { Fragment, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetCheckoutData, setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import addOrder from '@/services/orders/add';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import addOrderItems from '@/services/orders/items/add';
import addOrderShippingDetails from '@/services/orders/shipping-details/add';
import { clearCart } from '@/lib/redux/cart/cartSlice';
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
              show={!isBelowMedium && !!order.shipping_details[0]}
              order={order}
              borderColor={borderColor}
            />
            <OrderItems
              show={order.order_items.length > 0}
              order={order}
              borderColor={borderColor}
            />
          </Grid>
        );
      })}
    </>
  );
}
