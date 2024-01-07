'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, grey, red } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { usePathname } from 'next/navigation';

const getDesignTokens = (mode: 'light' | 'dark', isCheckoutFlow: boolean) => ({
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
            default: isCheckoutFlow ? grey[200] : '#fff',
            // paper: grey[200],
          },
          custom: {
            green: {
              dark: green[700],
            },
            primary: {
              light: '#42a5f5',
              dark: '#1976d2',
            },
            warning: {
              light: red[400],
              dark: red[600],
            },
            shade: {
              light: grey[200],
              medium: grey[600],
              dark: '#2e3131',
            },
            typography: 'rgba(0, 0, 0, 0.87)',
            typographyVariants: {
              black: 'rgba(0, 0, 0, 0.87)',
              grey: grey[600],
              white: '#fff',
            },
            textField: {
              label: 'rgba(0, 0, 0, 0.6)',
              border: 'rgba(0, 0, 0, 0.23)',
              hover: 'rgba(0, 0, 0, 0.87)',
              focused: 'rgba(0, 0, 0, 0.87)',
            },
            navBar: {
              upper: {
                text: '#fff',
                background: '#2e3131',
                divider: 'black',
              },
              lower: {
                text: grey[600],
                background: grey[200],
              },
            },
            dialog: {
              background: grey[200],
            },
            card: {
              background: '#fff',
            },
            border: 'rgba(0, 0, 0, 0.3)',
            boxShadow: 'rgba(0,0,0,0.15)',
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: 'black',
            // paper: '#2e3131',
          },
          custom: {
            green: {
              dark: green[700],
            },
            primary: {
              light: '#42a5f5',
              dark: '#1976d2',
            },
            warning: {
              light: red[400],
              dark: red[600],
            },
            shade: {
              light: grey[300],
              medium: grey[800],
              dark: grey[900],
            },
            typography: '#fff',
            typographyVariants: {
              black: 'rgba(0, 0, 0, 0.87)',
              grey: grey[300],
              white: '#fff',
            },
            textField: {
              label: 'rgba(255, 255, 255, 0.7)',
              border: 'rgba(255, 255, 255, 0.23)',
              hover: '#fff',
              focused: '#fff',
            },
            navBar: {
              upper: {
                text: '#fff',
                background: grey[900],
                divider: grey[900],
              },
              lower: {
                text: grey[300],
                background: grey[800],
              },
            },
            dialog: {
              background: grey[900],
            },
            card: {
              background: grey[900],
            },
            border: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'rgba(255,255,255,0.15)',
          },
        }),
  },
});

export type GetDesignTokensType = ReturnType<typeof getDesignTokens>;

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);
  const pathname = usePathname();
  const isCheckoutFlow = pathname.includes('/cart') || pathname.includes('/checkout');

  const theme = useMemo(() => createTheme(getDesignTokens(mode, isCheckoutFlow)), [mode, isCheckoutFlow]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
