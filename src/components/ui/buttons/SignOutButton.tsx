import AccountDropdownMenuItem from '@/components/accountDropdownMenu/AccountDropdownMenuItem';
import NavDrawerOption from '@/components/drawers/navDrawer/navDrawerOption/NavDrawerOption';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/slices/navDrawerSlice';
import signOut from '@/services/auth/sign-out';
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Props = {
  showNavDrawerButton?: boolean;
  showAccountMenuButton?: boolean;
  accountMenuIconColor?: string;
  accountMenuIconSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
};

export default function SignOutButton({
  showAccountMenuButton = false,
  showNavDrawerButton = false,
  accountMenuIconColor,
  accountMenuIconSize,
}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const colorPalette = useColorPalette();

  async function signOutUser() {
    const { success, message } = await signOut();

    if (success === true) {
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsNavDrawerOpen(false));
  }

  return (
    <>
      {showAccountMenuButton ? (
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

      {showNavDrawerButton ? (
        <NavDrawerOption
          onClick={signOutUser}
          label="Sign Out"
          bodyTextColor={colorPalette.navBar.lower.text}
        />
      ) : null}
    </>
  );
}
