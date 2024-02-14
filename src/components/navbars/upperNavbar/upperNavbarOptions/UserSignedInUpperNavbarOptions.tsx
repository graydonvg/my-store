'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../../drawers/cartDrawer/CartDrawer';
import AccountDropdownMenu from '@/components/accountDropdownMenu/AccountDropdownMenu';
import useColorPalette from '@/hooks/useColorPalette';
import { Favorite } from '@mui/icons-material';
import UpperNavbarIconButton from '@/components/navbars/upperNavbar/UpperNavbarIconButton';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import { toast } from 'react-toastify';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';

export default function UserSignedInUpperNavbarOptions() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const colorPalette = useColorPalette();

  function handleNavigateToWishlist() {
    toast.info('Wishlist coming soon!');
  }

  return (
    <>
      <List
        sx={{ display: 'flex', height: '100%' }}
        disablePadding>
        {!isBelowMedium ? (
          <ListItem disablePadding>
            <DividerUpperNavbarOptions />
            <UpperNavbarIconButton
              onClick={handleNavigateToWishlist}
              backgroundColor={colorPalette.navBar.upper.background}>
              <Favorite
                aria-label="Wishlist"
                sx={{ color: colorPalette.typographyVariants.white, opacity: '50%' }}
              />
            </UpperNavbarIconButton>
          </ListItem>
        ) : null}

        <ListItem disablePadding>
          <DividerUpperNavbarOptions />
          <CartDrawer />
        </ListItem>

        {!isBelowMedium && cartItems.length > 0 ? (
          <>
            <ListItem disablePadding>
              <DividerUpperNavbarOptions />
              <Box sx={{ padding: 0.5 }}>
                <CheckoutButton
                  height={'30px'}
                  minHeight={1}
                  label="checkout"
                  backgroundColor="primary"
                />
              </Box>
            </ListItem>
          </>
        ) : null}

        {!isBelowMedium ? (
          <ListItem disablePadding>
            <DividerUpperNavbarOptions />
            <AccountDropdownMenu />
            <DividerUpperNavbarOptions />
          </ListItem>
        ) : null}
      </List>
    </>
  );
}
