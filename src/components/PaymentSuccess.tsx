'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { resetCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import addOrder from '@/services/orders/add';
import addOrderItems from '@/services/orders/items/add';
import addOrderShippingDetails from '@/services/orders/shipping-details/add';
import { Box, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

type Props = {};

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const user_id = useAppSelector((state) => state.user.currentUser?.user_id);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const loaderColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  const createOrder = useCallback(
    async function handleCreateOrder() {
      const { data, success } = await addOrder({
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
          toast.success('Order created successfully');
          router.push('/orders');
          dispatch(resetCheckoutData());
          return;
        } else if (addOrderItemsResponse.success === false) {
          toast.error(addOrderItemsResponse.message);
          router.push('/');
          dispatch(resetCheckoutData());
          return;
        } else if (addOrderShippingDetailsResponse.success === false) {
          toast.error(addOrderShippingDetailsResponse.message);
          router.push('/');
          dispatch(resetCheckoutData());
          return;
        }
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
    if (checkoutData.isProcessing === true) {
      createOrder();
    }
  }, [checkoutData.isProcessing, createOrder, router]);

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
      <Typography fontSize={{ xs: 16, sm: 36 }}>Payment successful!</Typography>
      <Typography fontSize={{ xs: 14, sm: 24 }}>Creating your order</Typography>
      <PulseLoader
        size={24}
        color={loaderColor}
        loading={true}
      />
    </Box>
  );
}
