'use client';

import { ReactNode, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useRouter } from 'next/navigation';
import createSupabaseBrowserClient from '@/lib/supabase/supabase-browser';

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;

  useEffect(() => {
    async function getUserSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push('/');
      }
    }
    getUserSession();
  }, [supabase.auth, router]);

  return (
    <Container
      sx={{
        paddingTop: { xs: 1.75, sm: 2 },
        paddingX: { xs: 0.75, sm: 0 },
      }}
      disableGutters
      maxWidth="lg">
      <Box
        sx={{
          margin: '0 auto',
          boxShadow: 5,
          borderRadius: '4px',
          padding: 4,
          maxWidth: 400,
          backgroundColor: mode === 'dark' ? customColorPalette.grey.dark : 'white',
        }}>
        {children}
      </Box>
    </Container>
  );
}
