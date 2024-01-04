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
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const user_id = useAppSelector((state) => state.user.currentUser?.user_id);
  const paymentStatus = searchParams.get('payment');
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  const createOrder = useCallback(
    async function handleCreateOrder() {
      const { data, success, message } = await addOrder({
        cart_total: checkoutData.paymentTotals.cartTotal,
        delivery_fee: checkoutData.paymentTotals.deliveryFee,
        discount_total: checkoutData.paymentTotals.totalDiscount,
        order_total: checkoutData.paymentTotals.orderTotal,
        user_id: user_id!,
        is_paid: true,
      });

      if (success === true && !!data) {
        const shippingDetails = checkoutData.shippingDetails!;

        const createOrderItems = checkoutData.orderItems.map((item) => {
          return {
            ...item,
            order_id: data.order_id,
            user_id: user_id!,
          };
        });

        const addOrderItemsPromise = addOrderItems(createOrderItems);

        const addOrderShippingDetailsPromise = addOrderShippingDetails({
          ...shippingDetails,
          order_id: data.order_id,
          user_id: user_id!,
        });

        const [addOrderItemsResponse, addOrderShippingDetailsResponse] = await Promise.all([
          addOrderItemsPromise,
          addOrderShippingDetailsPromise,
        ]);

        if (addOrderItemsResponse.success === true && addOrderShippingDetailsResponse.success === true) {
          router.push('/orders');
          toast.success('Order created successfully');
          dispatch(resetCheckoutData());
          // dispatch(clearCart());
        } else if (addOrderItemsResponse.success === false) {
          toast.error(addOrderItemsResponse.message);
          dispatch(resetCheckoutData());
          // dispatch(clearCart());
        } else if (addOrderShippingDetailsResponse.success === false) {
          toast.error(addOrderShippingDetailsResponse.message);
          dispatch(resetCheckoutData());
          // dispatch(clearCart());
        }
      } else {
        toast.error(message);
        dispatch(resetCheckoutData());
        // dispatch(clearCart());
      }
    },

    [
      router,
      dispatch,
      checkoutData.orderItems,
      checkoutData.shippingDetails,
      checkoutData.paymentTotals.cartTotal,
      checkoutData.paymentTotals.deliveryFee,
      checkoutData.paymentTotals.orderTotal,
      checkoutData.paymentTotals.totalDiscount,
      user_id,
    ]
  );

  useEffect(() => {
    if (checkoutData.isProcessing === true && paymentStatus === 'success') {
      createOrder();
    }
  }, [checkoutData.isProcessing, paymentStatus, createOrder, router]);

  if (checkoutData.isProcessing === true)
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}>
        <Typography fontSize={{ xs: 16, sm: 36 }}>Payment successfull!</Typography>
        <Typography fontSize={{ xs: 14, sm: 24 }}>Creating your order</Typography>
        <PulseLoader
          size={24}
          color="white"
          loading={checkoutData.isProcessing}
        />
      </Box>
    );

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
