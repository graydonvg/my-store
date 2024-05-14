'use client';

import { ReactNode, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setCheckoutData } from '@/lib/redux/slices/checkoutDataSlice';
import deleteOrder from '@/services/orders/delete';
import CheckoutOrderTotals from '@/components/checkoutFlow/CheckoutOrderTotals';
import NavbarCheckout from '@/components/navbars/NavbarCheckout';

type Props = {
  children: ReactNode;
};

export default function LayoutCheckoutFlowClient({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const isPaymentView = pathname.includes('/checkout/payment');
  const isCheckoutPath = pathname.includes('/checkout');
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment-status');
  const shouldRedirect =
    isCheckoutPath && !paymentStatus && cartItems.length === 0 && checkoutData.isProcessing === false;

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/cart/view');
    } else if (paymentStatus === 'cancel' && checkoutData.isProcessing) {
      dispatch(setCheckoutData({ isProcessing: false }));

      if (checkoutData.orderId) {
        const deleteCanceledOrder = async () => {
          await deleteOrder(checkoutData.orderId!);
        };

        deleteCanceledOrder();
      }
    } else {
      return;
    }
  }, [
    dispatch,
    shouldRedirect,
    cartItems.length,
    isCheckoutPath,
    router,
    paymentStatus,
    checkoutData.orderId,
    checkoutData.isProcessing,
  ]);

  if (shouldRedirect) return null;

  return (
    <>
      <NavbarCheckout />
      <Container
        component="main"
        sx={{
          paddingY: { xs: 2, sm: 3 },
        }}
        maxWidth="lg">
        <Grid
          container
          spacing={2}>
          <Grid
            item
            xs={12}
            md={!isPaymentView ? 9 : 12}>
            {children}
          </Grid>
          {!isPaymentView ? <CheckoutOrderTotals /> : null}
        </Grid>
      </Container>
    </>
  );
}
