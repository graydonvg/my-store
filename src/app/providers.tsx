'use client';

import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { store } from '../lib/redux/store';
import { Provider } from 'react-redux';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </Provider>
  );
}
