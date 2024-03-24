'use client';

import { ChevronLeft, Dashboard, LocalShipping, Logout, People, ShoppingCart, Store } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Container,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode, useState } from 'react';
import { setUserData } from '@/lib/redux/slices/userSlice';
import { toast } from 'react-toastify';
import signOut from '@/services/auth/sign-out';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import useColorPalette from '@/hooks/useColorPalette';

const drawerWidth: number = 240;

const mainListItems = [
  {
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin',
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const colorPalette = useColorPalette();
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const mode = theme.palette.mode;

  function toggleDrawer() {
    setOpen(!open);
  }

  async function signOutUser() {
    const { success, message } = await signOut();

    if (success === true) {
      dispatch(setUserData(null));
      router.push('/');
    } else {
      toast.error(message);
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AdminNavbar
        toggleDrawer={toggleDrawer}
        open={open}
      />
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            position: 'fixed',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: { xs: theme.spacing(7), sm: theme.spacing(9) },
            }),
          },
        }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          ))}
          <Divider sx={{ my: 1 }} />
          <Link href={'/'}>
            <ListItemButton>
              <ListItemIcon>
                <Store />
              </ListItemIcon>
              <ListItemText primary="Client View" />
            </ListItemButton>
          </Link>
          <ListItemButton onClick={signOutUser}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </List>
      </Drawer>
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          height: '100vh',
          backgroundColor: mode === 'dark' ? 'black' : colorPalette.shade.light,
          paddingY: 2,
          paddingX: 4,
          marginRight: 'unset !important',
          marginLeft: `${drawerWidth}px !important`,
          transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          ...(!open && {
            marginLeft: { xs: theme.spacing(7), sm: theme.spacing(9) },
          }),
        }}>
        <Toolbar />
        {children}
      </Container>
    </Box>
  );
}
