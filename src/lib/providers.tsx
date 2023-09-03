'use client';

import { store } from './redux/store';
import { Provider } from 'react-redux';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const theme = useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode: prefersDarkMode ? 'dark' : 'light',
  //       },
  //     }),
  //   [prefersDarkMode]
  // );

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      // mode: 'dark',
    },
  });

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}
