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
          backgroundColor: darkMode ? theme.palette.custom.navbar.upper : theme.palette.background.paper,
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
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ color: theme.palette.custom.navbar.lower.text }}
              />
            </ListItemButton>
          </Link>
        ))}
        <Divider />
        <Link href={'/'}>
          <ListItemButton>
            <ListItemIcon>
              <Store />
            </ListItemIcon>
            <ListItemText
              primary="Client View"
              sx={{ color: theme.palette.custom.navbar.lower.text }}
            />
          </ListItemButton>
        </Link>
        <SignOutButton buttonVariant="permanentDrawer" />
      </List>
    </Drawer>
  );
}
