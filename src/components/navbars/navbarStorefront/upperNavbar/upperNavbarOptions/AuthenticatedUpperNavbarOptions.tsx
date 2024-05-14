'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../../../drawers/cartDrawer/CartDrawer';
import AccountDropdownMenu from '@/components/accountDropdownMenu/AccountDropdownMenu';
import { Favorite } from '@mui/icons-material';
import UpperNavbarIconButton from '@/components/navbars/navbarStorefront/upperNavbar/UpperNavbarIconButton';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';
import { useRouter } from 'next/navigation';

export default function AuthenticatedUpperNavbarOptions() {
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  function navigateToWishlist() {
    router.push('/wishlist');
  }

  return (
    <>
      <List
        component="nav"
        sx={{ display: 'flex', height: 1 }}
        disablePadding>
        {!isBelowMedium ? (
          <ListItem disablePadding>
            <DividerUpperNavbarOptions />
            <UpperNavbarIconButton
              onClick={navigateToWishlist}
              backgroundColor={theme.palette.custom.navbar.upper.background}>
              <Typography
                component="span"
                fontSize={16}
                sx={{ color: theme.palette.custom.navbar.upper.text, marginLeft: 1 }}>
                Wishlist
              </Typography>
              <Favorite
                aria-label="Wishlist"
                sx={{ color: theme.palette.grey[500], marginLeft: 1 }}
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
              <Box sx={{ padding: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 1 }}>
                <CheckoutButton
                  label="checkout"
                  sxStyles={{ height: '30px', minHeight: '30px' }}
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
