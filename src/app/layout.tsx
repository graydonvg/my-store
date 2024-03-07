import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Container } from '@mui/material';
import Toast from '@/components/ui/Toast';
import Navbar from '@/components/navbars/Navbar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { STORE_NAME } from '@/config';

export const metadata: Metadata = {
  title: STORE_NAME,
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userDataArray } = await supabase
    .from('users')
    .select('*, addresses(*)')
    .order('createdAt', { ascending: false, referencedTable: 'addresses' });

  const userData = userDataArray ? userDataArray[0] : null;

  let cartItems = null;

  if (userData) {
    const { data: cart } = await supabase
      .from('cart')
      .select(
        'createdAt, cartItemId, quantity, size, product: products!inner(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData!inner(imageUrl, index))'
      )
      .order('createdAt', { ascending: false });

    cartItems = cart;
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter
            userData={userData}
            user={user}
          />
          <CartItemsStateSetter cartItems={cartItems} />
          <Navbar />
          <Container
            sx={{
              paddingY: { xs: 2, sm: 3 },
            }}
            maxWidth="lg">
            {children}
          </Container>
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
