'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../drawers/CartDrawer';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import AccountMenu from '@/components/accountDropdownMenu/AccountMenu';
import NavbarTitleAndLogo from '../../ui/NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavDrawer from '../../drawers/navDrawer/NavDrawer';
import { Favorite } from '@mui/icons-material';
import UpperNavIconButton from '@/components/ui/buttons/upperNavIconButton';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';

function CustomDivider() {
  const customColorPalette = useCustomColorPalette();

  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: customColorPalette.navBar.upper.divider,
      }}
      flexItem
    />
  );
}

type UserSignedOutOptionsProps = {
  show: boolean;
};

type FavoriteButtonProps = {
  show: boolean;
};

function FavoriteButton({ show }: FavoriteButtonProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <ListItem disablePadding>
      <UpperNavIconButton backgroundColor={customColorPalette.navBar.upper.background}>
        <Favorite
          aria-label="Wishlist"
          sx={{ color: customColorPalette.typographyVariants.white, opacity: '50%' }}
        />
      </UpperNavIconButton>
    </ListItem>
  );
}

type CheckoutButtonProps = {
  show: boolean;
};

function GoToCheckoutButton({ show }: CheckoutButtonProps) {
  if (!show) return null;

  return (
    <>
      <CustomDivider />
      <ListItem
        disablePadding
        sx={{ padding: 0.5 }}>
        <CheckoutButton
          height={'30px'}
          minHeight={1}
          label="checkout"
          backgroundColor="blue"
        />
      </ListItem>
    </>
  );
}

type AccountDropdownMenuProps = {
  show: boolean;
};

function AccountDropdownMenu({ show }: AccountDropdownMenuProps) {
  if (!show) return null;

  return (
    <ListItem disablePadding>
      <AccountMenu />
    </ListItem>
  );
}

function UserSignedOutOptions({ show }: UserSignedOutOptionsProps) {
  const dispatch = useAppDispatch();
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  return (
    <List
      sx={{ display: 'flex', height: '100%' }}
      disablePadding>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex', marginRight: 16 } }}>
        <IconButton
          onClick={handleToggleTheme}
          size="small">
          <ThemeToggleIcon
            size="small"
            color={customColorPalette.navBar.upper.text}
          />
        </IconButton>
      </ListItem>
      <CustomDivider />
      <ListItem disablePadding>
        <SignInDialog />
      </ListItem>
      <CustomDivider />
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SignUpDialog />
      </ListItem>
      <CustomDivider />
    </List>
  );
}

type UserSignedInOptionsProps = {
  show: boolean;
};

function UserSignedInOptions({ show }: UserSignedInOptionsProps) {
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  if (!show) return null;

  return (
    <>
      <List
        sx={{ display: 'flex', height: '100%' }}
        disablePadding>
        <CustomDivider />
        <FavoriteButton show={!isBelowMedium} />
        <CustomDivider />
        <ListItem disablePadding>
          <CartDrawer />
        </ListItem>
        <GoToCheckoutButton show={!isBelowMedium && cartItems.length > 0} />
        <CustomDivider />
        <AccountDropdownMenu show={!isBelowMedium} />
        <CustomDivider />
      </List>
    </>
  );
}

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.userData);
  const customColorPalette = useCustomColorPalette();

  return (
    <>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}>
        <NavDrawer />
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={customColorPalette.navBar.upper.text}
      />
      <Box
        component="nav"
        sx={{ height: 1 }}>
        <UserSignedOutOptions show={!userData} />
        <UserSignedInOptions show={!!userData} />
      </Box>
    </>
  );
}
