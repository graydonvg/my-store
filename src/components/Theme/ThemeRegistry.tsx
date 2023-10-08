'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { grey } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';

const getDesignTokens = (mode: 'light' | 'dark') => ({
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
            default: 'white',
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
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: grey[900],
            // paper: grey[900],
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
          },
        }),
  },
});

export type GetDesignTokensType = ReturnType<typeof getDesignTokens>;

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
