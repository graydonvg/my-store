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
import { ADMIN_NAV_OPTIONS } from '@/components/AdminNavOptions';
import SignOutButton from '../ui/buttons/SignOutButton';

type Props = {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
};

export default function AdminNavDrawer({ open, toggleDrawer, drawerWidth }: Props) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: darkMode ? theme.palette.custom.navbar.upper.background : theme.palette.background.paper,
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
        {ADMIN_NAV_OPTIONS.map((item, index) => (
          <Link
            key={index}
            href={item.path}>
            <ListItemButton sx={{ color: theme.palette.text.secondary }}>
              <ListItemIcon sx={{ color: theme.palette.text.secondary }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
        <Divider />
        <Link href={'/'}>
          <ListItemButton sx={{ color: theme.palette.text.secondary }}>
            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
              <Store />
            </ListItemIcon>
            <ListItemText primary="Client View" />
          </ListItemButton>
        </Link>
        <SignOutButton buttonVariant="permanentDrawer" />
      </List>
    </Drawer>
  );
}
