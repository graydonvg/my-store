'use client';

import { ReactNode } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectCartTotal,
  selectTotalDiscount,
  selectOrderTotal,
} from '@/lib/redux/cart/cartSelectors';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { borderRadius } from '@/constants/styles';
import OrderTotals from '@/components/OrderTotals';
import payWithStripe from '@/utils/payWithStripe';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { toast } from 'react-toastify';
import addOrder from '@/services/orders/add';
import { calculateDiscountedCartItemPrice } from '@/utils/calculateDiscountedPrice';

type Props = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: Props) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const { cartItems } = useAppSelector((state) => state.cart);
  const cartTotal = selectCartTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const orderTotal = selectOrderTotal(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const isCartView = pathname.includes('/cart/view');
  const isShippingView = pathname.includes('/checkout/shipping');

  function handleCheckout() {
    const createOrderItems = cartItems.map((item) => {
      const price_paid = item?.product?.on_sale ? calculateDiscountedCartItemPrice(item) : item?.product?.price;
      return {
        product_id: item?.product?.product_id!,
        quantity: item?.quantity!,
        size: item?.size!,
        price_paid: price_paid!,
        product_name: item?.product?.name!,
        product_image_url: item?.product?.product_image_data[0].image_url!,
        return_details: item?.product?.return_info!,
      };
    });
    dispatch(
      setCheckoutData({
        paymentTotals: { cartTotal, deliveryFee, orderTotal, totalDiscount },
        orderItems: createOrderItems,
        isProcessing: true,
      })
    );
    router.push('/checkout/shipping');
  }

  async function handlePayWithStripe() {
    try {
      dispatch(setCheckoutData({ isProcessing: true }));

      const error = await payWithStripe(cartItems);

      if (!!error) {
        dispatch(setCheckoutData({ isProcessing: false }));
      }
    } catch (error) {
      toast.error('Failed to process payment. Please try again later');
    }
  }

  return (
    <CommonLayoutContainer>
      <Grid
        container
        columnSpacing={2}
        rowSpacing={0}>
        <Grid
          item
          xs={12}
          md={9}>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          md={3}>
          <Box
            sx={{
              paddingX: 3,
              paddingY: 4,
              backgroundColor: cardBackgroundColor,
              borderRadius: borderRadius,
            }}>
            <Typography
              component="h1"
              fontFamily="Source Sans Pro,sans-serif"
              fontSize={30}
              lineHeight={1}>
              Your Order
            </Typography>
            <OrderTotals
              cartTotal={cartTotal}
              totalDiscount={totalDiscount}
              deliveryFee={deliveryFee}
              orderTotal={orderTotal}
              totalToPay={orderTotal}
            />
            <ContainedButton
              disabled={cartItems.length === 0 || (isShippingView && !checkoutData.shippingDetails)}
              onClick={isCartView ? handleCheckout : handlePayWithStripe}
              label={(isCartView && 'checkout now') || (isShippingView && 'continue to payment')}
              fullWidth
              backgroundColor={isCartView ? 'blue' : 'red'}
            />
          </Box>
        </Grid>
      </Grid>
    </CommonLayoutContainer>
  );
}
