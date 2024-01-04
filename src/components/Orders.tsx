'use client';

import { OrderType } from '@/types';
import { Box, Grid, Typography } from '@mui/material';
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
    },

    [
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
      //if success
      // dispatch(resetCheckoutData())
      // router.push('/orders');
      // toast.success('Payment successfull!');
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
        }}>
        <PulseLoader
          size={40}
          color="white"
          loading={checkoutData.isProcessing}
        />
      </Box>
    );

  if (!show) return null;

  return (
    <>
      {orders?.map((order) => {
        const shippingDetails = order.shipping_details;
        const { full_name, complex_or_building, street_address, suburb, province, city, postal_code } =
          shippingDetails[0];

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
              <Box sx={{ border: '1px solid black', borderRadius, padding: 2 }}>
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
                      {[full_name, complex_or_building, street_address, suburb, province, city, postal_code].map(
                        (value) => (
                          <Typography
                            key={value}
                            component="h3"
                            fontSize={14}>
                            {value}
                          </Typography>
                        )
                      )}
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
              <Box sx={{ border: '1px solid black', borderRadius, padding: 2 }}>
                <Grid
                  container
                  spacing={2}>
                  {orderItems.map((item) => (
                    <Grid
                      key={item.order_item_id}
                      item
                      xs={6}>
                      <Grid
                        container
                        spacing={2}>
                        <Grid
                          item
                          xs={4}>
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
                          xs={8}>
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
