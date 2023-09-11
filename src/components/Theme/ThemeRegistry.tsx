'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { grey } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          minHeight: 'unset',
          '@media (min-width: 600px)': {
            minHeight: 'unset',
          },
        },
      },
    },
  },

  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode

          navbar: {
            background: '#1976d2',
            text: '#ffffff',
            icon: '#ffffff',
          },
          navDrawer: {
            headerBackground: '#1976d2',
            headerText: '#ffffff',
            bodyBackground: '#ffffff',
            bodyText: grey[900],
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: grey[800],
            paper: grey[900],
          },
          navbar: {
            background: grey[900],
            text: '#ffffff',
            icon: '#ffffff',
          },
          navDrawer: {
            headerBackground: grey[900],
            headerText: '#ffffff',
            bodyBackground: grey[800],
            bodyText: '#ffffff',
          },
        }),
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
