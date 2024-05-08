import { ChevronLeft, Store } from '@mui/icons-material';
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
import { ADMIN_PANEL_NAV_OPTIONS } from '@/components/AdminPanelNavOptions';
import SignOutButton from '../ui/buttons/SignOutButton';

type Props = {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
};

export default function NavDrawerAdminPanel({ open, toggleDrawer, drawerWidth }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? theme.palette.custom.navbar.upper.background : theme.palette.common.white,
          position: 'fixed',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          ...(!open && {
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
        <IconButton onClick={toggleDrawer}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {ADMIN_PANEL_NAV_OPTIONS.map((item, index) => (
          <Link
            key={index}
            href={item.path}>
            <ListItemButton sx={{ color: theme.palette.text.secondary }}>
              <ListItemIcon sx={{ color: theme.palette.text.secondary, marginLeft: 0.5 }}>{item.icon}</ListItemIcon>
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
        <SignOutButton buttonVariant="permanentDrawer" />
      </List>
    </Drawer>
  );
}
