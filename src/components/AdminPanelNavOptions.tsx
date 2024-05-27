import { Dashboard, LocalShipping, People, ShoppingCart } from '@mui/icons-material';

export const adminPanelNavOptions = [
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
    label: 'Orders',
    icon: <LocalShipping />,
    path: '/admin/orders',
  },
  {
    label: 'Users',
    icon: <People />,
    path: '/admin/users',
  },
];
