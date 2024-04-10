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
import StateSetters from '@/components/stateSetters/StateSetters';

export const metadata: Metadata = {
  title: STORE_NAME,
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StateSetters />
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
