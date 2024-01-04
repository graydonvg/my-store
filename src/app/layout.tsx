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

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: user } = await supabase.from('users').select('*, addresses(*)');
  const userData = !!user ? user[0] : null;
  let cartItems = null;

  if (user) {
    const { data: cart } = await supabase
      .from('cart')
      .select(
        'created_at, cart_item_id, quantity, size, product: products!inner(name, on_sale, price, sale_percentage, delivery_info, return_info, product_id, sizes, brand, product_image_data!inner(image_url))'
      )
      .order('created_at', { ascending: false });

    cartItems = cart;
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter
            userData={userData}
            session={session}
          />
          <CartItemsStateSetter cartItems={cartItems} />
          <Navbar />
          <main>
            <Container
              sx={{
                paddingY: { xs: 2, sm: 3 },
              }}
              maxWidth="lg">
              {children}
            </Container>
          </main>
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
