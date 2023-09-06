'use client';

import { ReactNode, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { ThemeToggleContext } from '../ThemeToggle/ThemeToggleContext';
import { grey } from '@mui/material/colors';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        dispatch(toggleTheme());
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // palette values for light mode
                // primary: blue,
                // text: {
                //   primary: '#ffffff',
                //   secondary: '#ffffff',
                // },
                navbar: {
                  background: '#1976d2',
                  text: '#ffffff',
                  icon: '#ffffff',
                },
                navDrawer: {
                  headerBackground: '#1976d2',
                  headerText: '#ffffff',
                  contentBackground: '#ffffff',
                  contentText: grey[900],
                },
              }
            : {
                // palette values for dark mode
                // primary: deepOrange,
                background: {
                  default: grey[800],
                  paper: grey[900],
                },
                // text: {
                //   primary: '#ffffff',
                //   // secondary: grey[500],
                // },
                navbar: {
                  background: grey[900],
                  text: '#ffffff',
                  icon: '#ffffff',
                },
                navDrawer: {
                  headerBackground: grey[900],
                  headerText: '#ffffff',
                  contentBackground: grey[800],
                  contentText: '#ffffff',
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeToggleContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeToggleContext.Provider>
    </NextAppDirEmotionCacheProvider>
  );
}
