'use client';

import ThemeRegistry from '@/components/Theme/ThemeRegistry';
import { persistor, store } from '../lib/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </PersistGate>
    </Provider>
  );
}
