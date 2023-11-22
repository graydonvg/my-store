'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, grey, red } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { usePathname } from 'next/navigation';

const getDesignTokens = (mode: 'light' | 'dark', isCartView: boolean) => ({
  // components: {
  //   MuiToolbar: {
  //     styleOverrides: {
  //       regular: {
  //         minHeight: 'unset',
  //         '@media (min-width: 600px)': {
  //           minHeight: 'unset',
  //         },
  //       },
  //     },
  //   },
  // },

  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          background: {
            default: isCartView ? grey[200] : 'white',
            // paper: grey[200],
          },
          custom: {
            grey: {
              dark: '#2e3131',
              medium: grey[600],
              light: grey[200],
            },
            blue: {
              dark: '#1976d2',
              light: '#42a5f5',
            },
            red: {
              dark: red[600],
              light: red[400],
            },
            green: {
              dark: green[700],
            },
            black: {
              opacity: {
                lighter: 'rgba(0, 0, 0, 0.26)',
                light: 'rgba(0, 0, 0, 0.3)',
                medium: 'rgba(0, 0, 0, 0.5)',
                strong: 'rgba(0, 0, 0, 0.6)',
              },
            },
            white: {
              opacity: {
                light: 'rgba(255, 255, 255, 0.3)',
                strong: 'rgba(255, 255, 255, 0.7)',
              },
            },
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: 'black',
            // paper: '#2e3131',
          },
          custom: {
            grey: {
              dark: grey[900],
              medium: grey[800],
              light: grey[300],
            },
            blue: {
              dark: '#1976d2',
              light: '#42a5f5',
            },
            red: {
              dark: red[600],
              light: red[400],
            },
            green: {
              dark: green[700],
            },
            black: {
              opacity: {
                lighter: 'rgba(0, 0, 0, 0.26)',
                light: 'rgba(0, 0, 0, 0.3)',
                medium: 'rgba(0, 0, 0, 0.5)',
                strong: 'rgba(0, 0, 0, 0.6)',
              },
            },
            white: {
              opacity: {
                light: 'rgba(255, 255, 255, 0.3)',
                strong: 'rgba(255, 255, 255, 0.7)',
              },
            },
          },
        }),
  },
});

export type GetDesignTokensType = ReturnType<typeof getDesignTokens>;

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);
  const pathname = usePathname();
  const isCartView = pathname.includes('/cart/view');

  const theme = useMemo(() => createTheme(getDesignTokens(mode, isCartView)), [mode, isCartView]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
