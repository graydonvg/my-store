import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import Toast from '@/components/ui/Toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { STORE_NAME } from '@/data';
import UserStateSetter from '@/components/stateSetters/UserStateSetter';
import CartItemsStateSetter from '@/components/stateSetters/CartItemsStateSetter';
import WishlistDataStateSetter from '@/components/stateSetters/WishlistStateSetter';
import getInitialUserData from '@/lib/db/queries/getInitialUserData';
import { AxiomWebVitals } from 'next-axiom';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: STORE_NAME,
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { userData, cartItems, wishlistData } = await getInitialUserData();

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter userData={userData} />
          <CartItemsStateSetter cartItems={cartItems} />
          <WishlistDataStateSetter wishlistData={wishlistData} />
          {children}
          <Toast />
        </Providers>
        <SpeedInsights />
        <AxiomWebVitals />
      </body>
    </html>
  );
}
