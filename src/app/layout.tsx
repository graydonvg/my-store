import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { CONSTANTS } from '@/constants';
import { AxiomWebVitals } from 'next-axiom';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: CONSTANTS.STORE_NAME,
  description: CONSTANTS.STORE_DESCRIPTION,
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <AxiomWebVitals />
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        </Suspense>
      )}
    </html>
  );
}
