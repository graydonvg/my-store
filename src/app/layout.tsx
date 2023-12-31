import { ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Box, Container, Typography } from '@mui/material';
import Toast from '@/components/ui/Toast';
import Navbar from '@/components/navbars/Navbar';
import StateSetters from '@/components/stateSetters/StateSetters';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <StateSetters />
          </Suspense>
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
