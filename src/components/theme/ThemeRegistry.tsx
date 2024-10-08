'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme, darken, lighten } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, green, grey, red } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { usePathname } from 'next/navigation';
import { selectThemeMode } from '@/lib/redux/features/theme/themeSelectors';

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
          success: {
            main: green[700],
          },
          custom: {
            border: 'rgba(0, 0, 0, 0.3)',
            text: {
              link: '#1976d2',
            },
            dialog: {
              background: {
                primary: '#fff',
                accent: grey[200],
              },
            },
            navbar: {
              upper: {
                text: '#fff',
                background: '#2e3131',
              },
              lower: {
                text: grey[700],
                background: grey[200],
              },
              divider: 'rgba(0, 0, 0, 0.40)',
            },
            textField: {
              label: 'rgba(0, 0, 0, 0.6)',
              labelFocused: 'rgba(0, 0, 0, 0.87)',
              border: 'rgba(0, 0, 0, 0.23)',
              hover: 'rgba(0, 0, 0, 0.35)',
              focused: 'rgba(0, 0, 0, 0.35)',
              boxShadow:
                '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
            },
            dataGrid: {
              toolbar: grey[200],
              header: grey[200],
              footer: grey[200],
              border: 'rgba(224, 224, 224, 1)',
            },
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: darken(grey[900], 0.5),
          },
          primary: {
            main: blue[700],
          },
          secondary: {
            main: red[700],
          },
          success: {
            main: green[700],
          },
          custom: {
            border: 'rgba(255, 255, 255, 0.3)',
            text: {
              link: '#90caf9',
            },
            dialog: {
              background: {
                primary: grey[900],
                accent: lighten(grey[900], 0.05),
              },
            },
            navbar: {
              upper: {
                text: '#fff',
                background: grey[900],
              },
              lower: {
                text: grey[300],
                background: lighten(grey[900], 0.08),
              },
              divider: 'rgba(255, 255, 255, 0.12)',
            },
            textField: {
              label: 'rgba(255, 255, 255, 0.7)',
              labelFocused: 'rgba(255, 255, 255, 1)',
              border: 'rgba(255, 255, 255, 0.23)',
              hover: 'rgba(255, 255, 255, 0.35)',
              focused: 'rgba(255, 255, 255, 0.35)',
              boxShadow:
                '0px 3px 1px -2px rgba(255, 255, 255, 0.2), 0px 2px 2px 0px rgba(255, 255, 255, 0.14), 0px 1px 5px 0px rgba(255, 255, 255, 0.12)',
            },
            dataGrid: {
              toolbar: lighten(grey[900], 0.05),
              header: lighten(grey[900], 0.05),
              footer: lighten(grey[900], 0.05),
              border: 'rgba(81, 81, 81, 1)',
            },
          },
        }),
  },
});

export type GetDesignTokensType = ReturnType<typeof getDesignTokens>;

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector(selectThemeMode);
  const pathname = usePathname();

  const isCheckoutFlow = pathname.startsWith('/cart') || pathname.startsWith('/checkout');
  const isAdminDashboardPath = pathname.startsWith('/admin/dashboard');

  const hasGreyBgColor = isCheckoutFlow || isAdminDashboardPath;

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
