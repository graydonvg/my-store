'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { blue, green, grey } from '@mui/material/colors';
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
          action: {
            // hover: 'green',
          },
          background: {
            // default: grey[200],
            // paper: grey[200],
          },
          upperNavbar: {
            background: '#2e3131',
            text: '#ffffff',
            primaryIcon: '#ffffff',
            secondaryIcon: '#1976d2',
          },
          lowerNavbar: {
            background: '#f2f2f2',
            text: grey[700],
            primaryIcon: '#ffffff',
            secondaryIcon: '#1976d2',
          },
          dropdownMenu: {
            background: '#2e3131',
            text: '#ffffff',
            icon: '#ffffff',
            hover: grey[800],
          },
          navDrawer: {
            headerBackground: '#2e3131',
            headerText: '#ffffff',
            bodyBackground: '#f2f2f2',
            bodyText: grey[700],
          },
          modal: {
            background: '#f2f2f2',
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: grey[700],
            paper: grey[900],
          },
          upperNavbar: {
            background: grey[900],
            text: '#ffffff',
            primaryIcon: '#ffffff',
            secondaryIcon: '#1976d2',
          },
          lowerNavbar: {
            background: grey[800],
            text: '#ffffff',
            primaryIcon: '#ffffff',
            secondaryIcon: '#1976d2',
          },
          dropdownMenu: {
            background: grey[900],
            text: '#ffffff',
            icon: '#ffffff',
            hover: grey[800],
          },
          navDrawer: {
            headerBackground: grey[900],
            headerText: '#ffffff',
            bodyBackground: grey[700],
            bodyText: '#ffffff',
          },
          modal: {
            background: grey[900],
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
