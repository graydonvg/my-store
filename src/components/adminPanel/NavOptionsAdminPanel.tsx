import { Dashboard, LocalShipping, People, ShoppingCart } from '@mui/icons-material';

export const NAV_OPTIONS_ADMIN_PANEL = [
  {
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin/dashboard',
  },
  {
    label: 'Products',
    icon: <ShoppingCart />,
    path: '/admin/products',
  },
  {
    label: 'Users',
    icon: <People />,
    path: '/admin/users',
  },
  {
    label: 'Orders',
    icon: <LocalShipping />,
    path: '/admin/orders',
  },
];
