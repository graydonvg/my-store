import AccountMenuItem from '@/components/accountDropdownMenu/AccountMenuItem';
import NavDrawerOption from '@/components/drawers/navDrawer/NavDrawerOption';
import { accountMenuIconColor, accountMenuIconSize } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
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
  const customColorPalette = useCustomColorPalette();

  async function handleSignOut() {
    const { success, message } = await signOut();
    if (success === false) {
      toast.error(message);
    } else {
      toast.success(message);
      router.refresh();
    }

    dispatch(setIsNavDrawerOpen({ left: false }));
  }

  if (showAccountMenuButton)
    return (
      <AccountMenuItem
        text={'Sign Out'}
        icon={
          <Logout
            fontSize={accountMenuIconSize}
            sx={{ color: accountMenuIconColor }}
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
        bodyTextColor={customColorPalette.navBar.lower.text}
      />
    );
}
