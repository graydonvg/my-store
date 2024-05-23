'use client';

import { ReactNode } from 'react';
import { Container, Grid } from '@mui/material';
import { usePathname } from 'next/navigation';
import CheckoutOrderTotals from '@/components/checkoutFlow/CheckoutOrderTotals';
import CheckoutNavbar from '@/components/navbars/checkoutNavbar/CheckoutNavbar';

type Props = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: Props) {
  const pathname = usePathname();
  const isPaymentPath = pathname.startsWith('/checkout/payment');

  return (
    <>
      <CheckoutNavbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          padding: { xs: 2, sm: 3 },
        }}>
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}>
          <Grid
            item
            xs={12}
            md={!isPaymentPath ? 9 : 12}>
            {children}
          </Grid>
          {!isPaymentPath ? (
            <Grid
              item
              xs={12}
              md={3}>
              <CheckoutOrderTotals />
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </>
  );
}
