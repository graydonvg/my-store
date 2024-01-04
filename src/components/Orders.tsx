'use client';

import { OrderType } from '@/types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import OrderTotals from './OrderTotals';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';
import { useCallback, useEffect } from 'react';
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
  const isBelowLarge = useMediaQuery(theme.breakpoints.down('lg'));

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
        if (!order.shipping_details[0]) return null;

        const shippingDetails = Object.values(order.shipping_details[0]);

        const orderItems = order.order_items;

        return (
          <Grid
            key={order.order_id}
            container
            spacing={4}
            sx={{ marginBottom: 3 }}>
            <Grid
              item
              xs={3}>
              <Box sx={{ border: `1px solid ${borderColor}`, borderRadius, padding: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Typography
                      component="span"
                      fontSize={14}
                      fontWeight={600}
                      sx={{ opacity: '70%' }}>
                      Order Date:
                    </Typography>
                    <Typography
                      component="span"
                      fontSize={14}
                      color="blue">
                      {order.created_at.split('T')[0]}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    <Typography
                      component="h4"
                      fontSize={14}
                      fontWeight={500}
                      textTransform="uppercase">
                      Shipping Details:
                    </Typography>
                    <Box>
                      {shippingDetails.map((value) => (
                        <Typography
                          key={value}
                          component="h3"
                          fontSize={14}>
                          {value}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      component="h3"
                      fontSize={18}
                      fontWeight={600}>
                      Order Summary
                    </Typography>
                    <OrderTotals
                      cartTotal={order.cart_total}
                      totalDiscount={order.discount_total}
                      deliveryFee={order.delivery_fee}
                      orderTotal={order.order_total}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={9}>
              <Box sx={{ border: `1px solid ${borderColor}`, borderRadius, padding: 2 }}>
                <Grid
                  container
                  spacing={2}>
                  {orderItems.map((item) => (
                    <Grid
                      key={item.order_item_id}
                      item
                      xs={12}
                      lg={6}>
                      <Grid
                        container
                        spacing={2}>
                        <Grid
                          item
                          xs={2}
                          lg={4}>
                          <Box sx={{ position: 'relative', aspectRatio: 25 / 36 }}>
                            <Image
                              style={{
                                objectFit: 'cover',
                                borderRadius: borderRadius,
                                cursor: 'pointer',
                              }}
                              fill
                              priority
                              src={item.product_image_url}
                              alt={`Image of ${item.product_name}`}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          lg={8}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 2 }}>
                            <Typography fontSize={18}>{item.product_name}</Typography>
                            <Box>
                              {[
                                { label: 'qty', value: item?.quantity },
                                { label: 'fontSize', value: item?.size },
                                { label: 'price paid', value: formatCurrency(item?.price_paid) },
                              ].map((item) => (
                                <Box
                                  key={item.label}
                                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography
                                    fontSize={13}
                                    textTransform="uppercase"
                                    fontWeight={500}
                                    sx={{ opacity: '70%' }}>
                                    {item.label}:
                                  </Typography>
                                  <Typography fontSize={13}>{item.value}</Typography>
                                </Box>
                              ))}
                            </Box>
                            <Typography
                              fontSize={13}
                              textTransform="uppercase"
                              fontWeight={500}
                              sx={{ opacity: '70%' }}>
                              {item.return_details}:
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
