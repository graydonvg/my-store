import AccountDropdownMenuItem from '@/components/accountDropdownMenu/AccountDropdownMenuItem';
import NavDrawerOption from '@/components/drawers/navDrawer/navDrawerOption/NavDrawerOption';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import { setUserData } from '@/lib/redux/slices/userSlice';
import signOut from '@/services/auth/sign-out';
import { Logout } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Props = {
  buttonVariant: 'accountDropdownMenu' | 'navDrawer' | 'adminNavDrawer';
  accountMenuIconColor?: string;
  accountMenuIconSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
};

export default function SignOutButton({ buttonVariant, accountMenuIconColor, accountMenuIconSize }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function signOutUser() {
    const { success, message } = await signOut();

    if (success === true) {
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsNavDrawerOpen(false));
  }

  async function signOutFromAdminView() {
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

      {buttonVariant === 'navDrawer' ? (
        <NavDrawerOption
          onClick={signOutUser}
          label="Sign Out"
        />
      ) : null}

      {buttonVariant === 'adminNavDrawer' ? (
        <ListItemButton onClick={signOutFromAdminView}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            sx={{ color: (theme) => theme.palette.custom.navBar.lower.text }}
          />
        </ListItemButton>
      ) : null}
    </>
  );
}
