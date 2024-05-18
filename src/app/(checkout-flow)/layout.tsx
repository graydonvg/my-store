'use client';

import { ReactNode } from 'react';
import { Container, Grid } from '@mui/material';
import { usePathname } from 'next/navigation';
import CheckoutOrderTotals from '@/components/checkoutFlow/CheckoutOrderTotals';
import CheckoutNavbar from '@/components/navbars/CheckoutNavbar';

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
            md={!isPaymentPath ? 9 : 12}>
            {children}
          </Grid>
          {!isPaymentPath ? <CheckoutOrderTotals /> : null}
        </Grid>
      </Container>
    </>
  );
}
