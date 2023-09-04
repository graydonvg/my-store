'use client';

import { store } from '../lib/redux/store';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
    </Provider>
  );
}
