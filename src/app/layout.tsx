import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import Toast from '@/components/ui/Toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { STORE_NAME } from '@/config';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistStateSetter from '@/components/stateSetters/WishlistStateSetter';
import getInitialUserData from '@/lib/db/queries/getInitialUserData';

export const metadata: Metadata = {
  title: STORE_NAME,
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { userAuthData, userTableData, cartItems, wishlistItems } = await getInitialUserData();

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter
            user={userAuthData}
            userData={userTableData}
          />
          <CartItemsStateSetter cartItems={cartItems} />
          <WishlistStateSetter wishlistItems={wishlistItems} />
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
