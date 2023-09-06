import { drawerSlice } from './drawer/drawerSlice';
import { themeSlice } from './theme/themeSlice';

export const reducer = {
  drawer: drawerSlice.reducer,
  theme: themeSlice.reducer,
};
