'use client';

import MuiDrawer from '@mui/material/Drawer';
import { ChevronLeft, Dashboard, LocalShipping, Logout, Menu, People, ShoppingCart, Store } from '@mui/icons-material';
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useState } from 'react';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch } from '@/lib/redux/hooks';
import useColorPalette from '@/hooks/useColorPalette';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import Link from 'next/link';
import signOut from '@/services/auth/sign-out';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { setUserData } from '@/lib/redux/slices/userSlice';
import { ElevationScroll } from '../ui/ElevationScroll';

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

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function AdminNavbar() {
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colorPalette = useColorPalette();
  const router = useRouter();

  function toggleDrawer() {
    setOpen(!open);
  }

  function changeTheme() {
    dispatch(toggleTheme());
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
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          elevation={0}
          open={open}
          sx={{ backgroundColor: colorPalette.navBar.upper.background }}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}>
              <Menu />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <IconButton
              aria-label={`Toggle theme. Current mode is ${mode}.`}
              onClick={changeTheme}
              size="small">
              <ThemeToggleIcon
                size="small"
                color={colorPalette.navBar.upper.text}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Drawer
        variant="permanent"
        open={open}>
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
    </>
  );
}
