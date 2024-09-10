'use client';

import ThemeRegistry from '@/components/theme/ThemeRegistry';
import { persistor, store } from '../lib/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactNode } from 'react';
import Toast from '@/components/ui/Toast';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <ThemeRegistry>
          {children}
          <Toast />
        </ThemeRegistry>
      </PersistGate>
    </Provider>
  );
}
