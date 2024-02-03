import AccountDropdownMenuItem from '@/components/accountDropdownMenu/AccountDropdownMenuItem';
import NavDrawerOption from '@/components/drawers/navDrawer/navDrawerOption/NavDrawerOption';
import { ACCOUNT_MENU_ICON_COLOR, ACCOUNT_MENU_ICON_SIZE } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsNavDrawerOpen } from '@/lib/redux/navDrawer/navDrawerSlice';
import signOut from '@/services/auth/sign-out';
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Props = {
  showNavDrawerButton?: boolean;
  showAccountMenuButton?: boolean;
};

export default function SignOutButton({ showAccountMenuButton = false, showNavDrawerButton = false }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const colorPalette = useColorPalette();

  async function handleSignOut() {
    const { success, message } = await signOut();
    if (success === false) {
      toast.error(message);
    } else {
      toast.success(message);
      router.refresh();
    }

    dispatch(setIsNavDrawerOpen(false));
  }

  if (showAccountMenuButton)
    return (
      <AccountDropdownMenuItem
        label={'Sign Out'}
        icon={
          <Logout
            fontSize={ACCOUNT_MENU_ICON_SIZE}
            sx={{ color: ACCOUNT_MENU_ICON_COLOR }}
          />
        }
        onClick={handleSignOut}
      />
    );

  if (showNavDrawerButton)
    return (
      <NavDrawerOption
        onClick={handleSignOut}
        label="Sign Out"
        bodyTextColor={colorPalette.navBar.lower.text}
      />
    );
}
