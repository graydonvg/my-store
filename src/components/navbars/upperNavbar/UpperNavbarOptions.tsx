'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../drawers/CartDrawer';
import { ThemeToggleIcon } from '@/components/theme/ThemeToggleIcon';
import AccountDropdownMenu from '@/components/accountDropdownMenu/AccountDropdownMenu';
import NavbarTitleAndLogo from '../../ui/NavbarTitleAndLogo';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawer from '../../drawers/navDrawer/NavDrawer';
import { Favorite } from '@mui/icons-material';
import UpperNavIconButton from '@/components/ui/buttons/upperNavIconButton';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import { toast } from 'react-toastify';

function CustomDivider() {
  const colorPalette = useColorPalette();

  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: colorPalette.navBar.upper.divider,
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
  const colorPalette = useColorPalette();

  if (!show) return null;

  function handleNavigateToWishlist() {
    toast.info('Wishlist coming soon!');
  }

  return (
    <ListItem disablePadding>
      <UpperNavIconButton
        onClick={handleNavigateToWishlist}
        backgroundColor={colorPalette.navBar.upper.background}>
        <Favorite
          aria-label="Wishlist"
          sx={{ color: colorPalette.typographyVariants.white, opacity: '50%' }}
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

function UserSignedOutOptions({ show }: UserSignedOutOptionsProps) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

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
        sx={{ display: { xs: 'none', md: 'flex' }, gap: '11px' }}>
        <IconButton
          aria-label={`Toggle theme. Current mode is ${mode}.`}
          onClick={handleToggleTheme}
          size="small">
          <ThemeToggleIcon
            size="small"
            color={colorPalette.navBar.upper.text}
          />
        </IconButton>
        <CustomDivider />
      </ListItem>
      <ListItem disablePadding>
        <SignInDialog />
        <CustomDivider />
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SignUpDialog />
        <CustomDivider />
      </ListItem>
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
        {!isBelowMedium ? <AccountDropdownMenu /> : null}

        <CustomDivider />
      </List>
    </>
  );
}

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.userData);
  const colorPalette = useColorPalette();

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
        color={colorPalette.navBar.upper.text}
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
