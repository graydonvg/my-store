'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, Divider, IconButton, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../drawers/CartDrawer';
import { ThemeToggleIcon } from '@/components/ui/ThemeToggleIcon';
import AccountMenu from '@/components/AccountMenu';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavDrawer from '../../drawers/navDrawer/NavDrawer';
import { Favorite } from '@mui/icons-material';
import UpperNavIconButton from '@/components/ui/buttons/upperNavIconButton';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import SignInDialog from '@/components/dialogs/SignInDialog';
import SignUpDialog from '@/components/dialogs/SignUpDialog';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { useRouter } from 'next/navigation';
import { setIsCartOpen } from '@/lib/redux/cart/cartSlice';

function renderDivider() {
  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'custom.grey.dark' : 'black'),
      }}
      flexItem
    />
  );
}

export default function UpperNavbarOptions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { cartItems, isCartOpen } = useAppSelector((state) => state.cart);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  function handleToggleTheme() {
    dispatch(toggleTheme());
  }

  function handleGoToCheckout() {
    if (isCartOpen.right === true) {
      dispatch(setIsCartOpen({ ...isCartOpen, right: false }));
    }
    router.push('/checkout/shipping');
  }

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
        color={customColorPalette.grey.light}
      />
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {currentUser ? (
          <>
            <List
              sx={{ display: 'flex', height: '100%' }}
              disablePadding>
              {renderDivider()}
              {!isBelowMedium ? (
                <ListItem disablePadding>
                  <UpperNavIconButton backgroundColor={customColorPalette.grey.dark}>
                    <Favorite
                      aria-label="Wishlist"
                      sx={{ color: customColorPalette.grey.light, opacity: '50%' }}
                    />
                  </UpperNavIconButton>
                </ListItem>
              ) : null}
              {renderDivider()}
              <ListItem disablePadding>
                <CartDrawer />
              </ListItem>
              {renderDivider()}
              {!isBelowMedium && cartItems.length > 0 ? (
                <ListItem
                  disablePadding
                  sx={{ padding: 0.5 }}>
                  <ContainedButton
                    onClick={handleGoToCheckout}
                    height={'30px'}
                    minHeight={1}
                    label="checkout"
                    backgroundColor="blue"
                  />
                </ListItem>
              ) : null}
              {renderDivider()}
              {!isBelowMedium ? (
                <ListItem disablePadding>
                  <AccountMenu />
                </ListItem>
              ) : null}
              {renderDivider()}
            </List>
          </>
        ) : (
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
                  color={customColorPalette.grey.light}
                />
              </IconButton>
            </ListItem>
            {renderDivider()}
            <ListItem disablePadding>
              <SignInDialog />
            </ListItem>
            {renderDivider()}
            <ListItem
              disablePadding
              sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SignUpDialog />
            </ListItem>
            {renderDivider()}
          </List>
        )}
      </Box>
    </>
  );
}
