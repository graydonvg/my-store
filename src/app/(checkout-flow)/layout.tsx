'use client';

import { ReactNode } from 'react';
import { Container, Grid2, Paper } from '@mui/material';
import { usePathname } from 'next/navigation';
import CheckoutOrderTotals from '@/components/checkoutFlow/CheckoutOrderTotals';
import CheckoutNavbar from '@/components/navbars/checkoutNavbar/CheckoutNavbar';
import { BORDER_RADIUS } from '@/constants';
import CheckoutButton from '@/components/CheckoutButton';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';
import PaymentButton from '@/components/checkoutFlow/PaymentButton';

type Props = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: Props) {
  const pathname = usePathname();
  const cartItems = useAppSelector(selectCartItems);
  const isPaymentPath = pathname.startsWith('/checkout/payment');
  const isCartViewPath = pathname.startsWith('/cart/view');
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return (
    <>
      <CheckoutNavbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          padding: { xs: 2, sm: 3 },
        }}>
        <Grid2
          container
          spacing={{ xs: 2, sm: 3 }}>
          <Grid2 size={{ xs: 12, md: !isPaymentPath ? 9 : 12 }}>{children}</Grid2>
          {!isPaymentPath ? (
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Paper
                sx={{
                  paddingX: 3,
                  paddingY: 4,
                  borderRadius: BORDER_RADIUS,
                  minWidth: 'fit-content',
                }}>
                <CheckoutOrderTotals />

                {isCartViewPath ? (
                  <CheckoutButton
                    disabled={cartItems.length === 0}
                    label="checkout now"
                    fullWidth
                  />
                ) : null}

                {isShippingPath ? <PaymentButton /> : null}
              </Paper>
            </Grid2>
          ) : null}
        </Grid2>
      </Container>
    </>
  );
}
