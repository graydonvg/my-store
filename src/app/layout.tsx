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
import { AxiomWebVitals } from 'next-axiom';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: STORE_NAME,
  description: 'Ecommerce',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toast />
        </Providers>
        <SpeedInsights />
        <AxiomWebVitals />
      </body>
    </html>
  );
}
