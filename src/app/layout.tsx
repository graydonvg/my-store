import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import Toast from '@/components/ui/Toast';
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
  let userData = null;
  let cartItems = null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('users')
    .select(
      '*, addresses(*), cart!inner(createdAt, cartItemId, quantity, size, product: products!inner(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData!inner(imageUrl, index)))'
    )
    .order('createdAt', { ascending: false, referencedTable: 'addresses' })
    .order('createdAt', { ascending: false, referencedTable: 'cart' });

  if (data && data[0]) {
    const { cart, ...restOfData } = data[0];

    userData = restOfData;
    cartItems = cart;
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter
            user={user}
            userData={userData}
          />
          <CartItemsStateSetter cartItems={cartItems} />
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
