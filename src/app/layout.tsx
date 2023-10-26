import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Container } from '@mui/material';
import ModalComponent from '@/components/ui/modal/ModalComponent';
import DrawerComponent from '@/components/ui/DrawerComponent';
import Navbar from '@/components/navigation/navbar/Navbar';
import Toast from '@/components/ui/Toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            <Container
              sx={{ paddingX: 1, paddingY: 2 }}
              disableGutters
              maxWidth="lg">
              {children}
            </Container>
          </main>
          <DrawerComponent />
          <ModalComponent />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
