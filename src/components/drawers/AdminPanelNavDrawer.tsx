import { ChevronLeft, Dashboard, LocalShipping, Logout, People, ShoppingCart, Store } from '@mui/icons-material';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import SignOutButtonWrapper from '../SignOutButtonWrapper';
import { ADMIN_PANEL_NAV_OPTIONS } from '@/constants';

function getIcon(icon: string) {
  const icons = {
    Dashboard: <Dashboard />,
    Products: <ShoppingCart />,
    Orders: <LocalShipping />,
    Users: <People />,
  };

  return icons[icon as keyof typeof icons];
}

type Props = {
  drawerWidth: number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
};

export default function AdminPanelNavDrawer({ isDrawerOpen, toggleDrawer, drawerWidth }: Props) {
  const pathname = usePathname();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={isDrawerOpen}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? theme.palette.custom.navbar.upper.background : theme.palette.common.white,
          position: 'fixed',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          ...(!isDrawerOpen && {
            overflowX: 'hidden',
            width: { xs: theme.spacing(7), sm: theme.spacing(9) },
          }),
        },
      }}>
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingX: 1,
        }}>
        <IconButton
          onClick={toggleDrawer}
          aria-label="close drawer button">
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {ADMIN_PANEL_NAV_OPTIONS.map((item) => (
          <Link
            key={item.label}
            href={item.path}>
            <ListItemButton
              sx={{
                color: theme.palette.text.secondary,
                backgroundColor: pathname === item.path ? theme.palette.action.hover : null,
              }}>
              <ListItemIcon sx={{ color: theme.palette.text.secondary, marginLeft: 0.5 }}>
                {getIcon(item.label)}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
        <Divider />
        <Link href={'/'}>
          <ListItemButton sx={{ color: theme.palette.text.secondary }}>
            <ListItemIcon sx={{ color: theme.palette.text.secondary, marginLeft: 0.5 }}>
              <Store />
            </ListItemIcon>
            <ListItemText primary="Storefront" />
          </ListItemButton>
        </Link>
        <SignOutButtonWrapper>
          {({ signOutUser }) => {
            return (
              <ListItemButton
                onClick={signOutUser}
                sx={{ color: theme.palette.text.secondary }}>
                <ListItemIcon sx={{ color: theme.palette.text.secondary, marginLeft: 0.5 }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            );
          }}
        </SignOutButtonWrapper>
      </List>
    </Drawer>
  );
}
