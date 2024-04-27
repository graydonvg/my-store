'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme, darken, lighten } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey, red } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { usePathname } from 'next/navigation';

const getDesignTokens = (mode: 'light' | 'dark', hasWhiteBgColor: boolean, hasDarkerNavbar: boolean) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            // light: '#42a5f5',
            main: '#1976d2',
            // dark: '#1976d2',
            // contrastText: '#fff',
          },
          background: {
            default: hasWhiteBgColor ? '#fff' : grey[200],
          },
          custom: {
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
              dark: 'rgba(0, 0, 0, 0.87)',
              medium: grey[600],
              light: '#fff',
              link: '#1976d2',
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
                divider: 'rgba(0, 0, 0, 1)',
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
            button: {
              disabled: {
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              },
            },
            border: 'rgba(0, 0, 0, 0.3)',
            boxShadow: 'rgba(0, 0, 0, 0.15)',
            table: {
              toolbar: darken(grey[200], 0.02),
              header: lighten(grey[200], 0.3),
              footer: lighten(grey[200], 0.3),
              border: 'rgba(224, 224, 224, 1)',
            },
          },
        }
      : {
          // palette values for dark mode
          primary: {
            // light: '#42a5f5',
            main: '#42a5f5',
            // dark: '#1976d2',
            // contrastText: '#fff',
          },
          background: {
            default: 'rgba(0, 0, 0, 1)',
          },
          custom: {
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
              dark: 'rgba(0, 0, 0, 0.87)',
              medium: grey[300],
              light: '#fff',
              link: '#90caf9',
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
                background: hasDarkerNavbar ? '#121212' : grey[900],
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
            button: {
              disabled: {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              },
            },
            border: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'rgba(255, 255, 255, 0.15)',
            table: {
              toolbar: lighten('#121212', 0.05),
              header: lighten('#121212', 0.08),
              footer: lighten('#121212', 0.08),
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
  const isAdminView = pathname.includes('/admin');
  const hasWhiteBgColor = !isCheckoutFlow && !isAdminView;
  const hasDarkerNavbar = isAdminView;

  const theme = useMemo(
    () => createTheme(getDesignTokens(mode, hasWhiteBgColor, hasDarkerNavbar)),
    [mode, hasWhiteBgColor, hasDarkerNavbar]
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
