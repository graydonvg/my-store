import { ChevronLeft, Logout, Store } from '@mui/icons-material';
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
import signOut from '@/services/auth/sign-out';
import { setUserData } from '@/lib/redux/slices/userSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { ADMIN_NAV_OPTIONS } from '@/components/AdminNavOptions';

type Props = {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
};

export default function AdminNavDrawer({ open, toggleDrawer, drawerWidth }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
  );
}
