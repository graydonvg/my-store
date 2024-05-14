import AccountDropdownMenuItem from '@/components/accountDropdownMenu/AccountDropdownMenuItem';
import NavDrawerOption from '@/components/drawers/navDrawer/navDrawerOption/NavDrawerOption';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { setUserData } from '@/lib/redux/slices/userSlice';
import signOut from '@/services/auth/sign-out';
import { Logout } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Props = {
  buttonVariant: 'accountDropdownMenu' | 'temporaryDrawer' | 'permanentDrawer';
  accountMenuIconColor?: string;
  accountMenuIconSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
};

export default function SignOutButton({ buttonVariant, accountMenuIconColor, accountMenuIconSize }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const redirectAfterSignout =
    pathname.includes('/admin') ||
    pathname.includes('/account') ||
    pathname.includes('/orders') ||
    pathname.includes('/wishlist');

  async function signOutUser() {
    const { success, message } = await signOut();

    if (success === true) {
      dispatch(setUserData(null));

      if (redirectAfterSignout) {
        router.push('/');
      }
      // NB!!! refresh must come after push!!!
      router.refresh();
    } else {
      toast.error(message);
    }

    buttonVariant === 'temporaryDrawer' && dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <>
      {buttonVariant === 'accountDropdownMenu' ? (
        <AccountDropdownMenuItem
          label={'Sign Out'}
          icon={
            <Logout
              fontSize={accountMenuIconSize}
              sx={{ color: accountMenuIconColor }}
            />
          }
          onClick={signOutUser}
        />
      ) : null}

      {buttonVariant === 'temporaryDrawer' ? (
        <NavDrawerOption
          onClick={signOutUser}
          label="Sign Out"
        />
      ) : null}

      {buttonVariant === 'permanentDrawer' ? (
        <ListItemButton
          onClick={signOutUser}
          sx={{ color: theme.palette.text.secondary }}>
          <ListItemIcon sx={{ color: theme.palette.text.secondary, marginLeft: 0.5 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      ) : null}
    </>
  );
}
