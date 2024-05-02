'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme, lighten } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, grey, red } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { usePathname } from 'next/navigation';

const getDesignTokens = (mode: 'light' | 'dark', hasGreyBgColor: boolean) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          background: {
            default: hasGreyBgColor ? grey[200] : '#fff',
          },
          primary: {
            main: blue[700],
          },
          secondary: {
            main: red[700],
          },
          custom: {
            border: 'rgba(0, 0, 0, 0.3)',
            boxShadow: 'rgba(0, 0, 0, 0.15)',
            text: {
              link: '#1976d2',
            },
            navbar: {
              upper: {
                text: '#fff',
                background: '#2e3131',
                divider: 'rgba(0, 0, 0, 1)',
              },
              lower: {
                text: grey[600],
                background: grey[200],
              },
            },
            textField: {
              label: 'rgba(0, 0, 0, 0.6)',
              border: 'rgba(0, 0, 0, 0.23)',
              hover: 'rgba(0, 0, 0, 0.87)',
              focused: 'rgba(0, 0, 0, 0.87)',
            },
            dataGrid: {
              toolbar: grey[300],
              header: grey[200],
              footer: grey[200],
              border: 'rgba(224, 224, 224, 1)',
            },
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: 'rgba(0, 0, 0, 1)',
            paper: grey[900],
          },
          primary: {
            main: blue[700],
          },
          secondary: {
            main: red[700],
          },
          custom: {
            border: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'rgba(255, 255, 255, 0.15)',
            text: {
              link: '#90caf9',
            },
            navbar: {
              upper: {
                text: '#fff',
                background: grey[900],
                divider: grey[900],
              },
              lower: {
                text: grey[300],
                background: lighten(grey[900], 0.08),
              },
            },
            textField: {
              label: 'rgba(255, 255, 255, 0.7)',
              border: 'rgba(255, 255, 255, 0.23)',
              hover: '#fff',
              focused: '#fff',
            },
            dataGrid: {
              toolbar: lighten(grey[900], 0.05),
              header: lighten(grey[900], 0.08),
              footer: lighten(grey[900], 0.08),
              border: 'rgba(81, 81, 81, 1)',
            },
          },
        }),
  },
});

export type GetDesignTokensType = ReturnType<typeof getDesignTokens>;

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);
  const pathname = usePathname();

  const isCheckoutFlow = pathname.includes('/cart') || pathname.includes('/checkout');
  const isAdminDashboard = pathname.includes('/admin/dashboard');

  const hasGreyBgColor = isCheckoutFlow || isAdminDashboard;

  const theme = useMemo(() => createTheme(getDesignTokens(mode, hasGreyBgColor)), [mode, hasGreyBgColor]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
