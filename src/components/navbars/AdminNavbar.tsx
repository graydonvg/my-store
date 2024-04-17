import { ChevronLeft, Logout, Menu, Store } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { ElevationScroll } from '../ui/ElevationScroll';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import signOut from '@/services/auth/sign-out';
import { setUserData } from '@/lib/redux/slices/userSlice';
import { toast } from 'react-toastify';
import { ReactNode } from 'react';
import { ADMIN_NAV_OPTIONS } from '../AdminNavOptions';

const drawerWidth: number = 240;

type Props = {
  open: boolean;
  toggleDrawer: () => void;
  children: ReactNode;
};

export default function AdminNavbar({ open, toggleDrawer, children }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';

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
          sx={{
            backgroundColor: 'transparent',
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
          }}>
          <Box sx={{ backgroundColor: theme.palette.custom.navBar.upper.background }}>
            <Toolbar>
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
                sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
                {currentPath}
              </Typography>
              <IconButton
                aria-label={`Toggle theme. Current mode is ${mode}.`}
                onClick={changeTheme}
                size="small">
                <ThemeToggleIcon
                  size="small"
                  color={theme.palette.custom.navBar.upper.text}
                />
              </IconButton>
            </Toolbar>
          </Box>
        </AppBar>
      </ElevationScroll>
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
              width: { xs: theme.spacing(7), sm: theme.spacing(9) },
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
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
          {ADMIN_NAV_OPTIONS.map((item, index) => (
            <Link
              key={index}
              href={item.path}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ color: theme.palette.custom.navBar.lower.text }}
                />
              </ListItemButton>
            </Link>
          ))}
          <Divider sx={{ my: 1 }} />
          <Link href={'/'}>
            <ListItemButton>
              <ListItemIcon>
                <Store />
              </ListItemIcon>
              <ListItemText
                primary="Client View"
                sx={{ color: theme.palette.custom.navBar.lower.text }}
              />
            </ListItemButton>
          </Link>
          <ListItemButton onClick={signOutUser}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              sx={{ color: theme.palette.custom.navBar.lower.text }}
            />
          </ListItemButton>
        </List>
      </Drawer>
      <Container
        component="main"
        maxWidth="lg"
        disableGutters
        sx={{
          paddingY: 3,
          paddingX: 3,
          marginRight: 0,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(!open && {
            marginLeft: { xs: theme.spacing(7), sm: theme.spacing(9) },
            transition: theme.transitions.create('margin-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }),
        }}>
        <Toolbar />
        {children}
      </Container>
    </>
  );
}
