'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem, Typography, useTheme } from '@mui/material';
import CartDrawer from '../../../../drawers/cartDrawer/CartDrawer';
import AccountDropdownMenu from '@/components/accountDropdownMenu/AccountDropdownMenu';
import { Favorite } from '@mui/icons-material';
import UpperNavbarIconButton from '@/components/navbars/navbarStorefront/upperNavbar/UpperNavbarIconButton';
import CheckoutButton from '@/components/checkoutFlow/CheckoutButton';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';
import { useRouter } from 'next/navigation';

export default function AuthenticatedUpperNavbarOptions() {
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();

  function navigateToWishlist() {
    router.push('/wishlist');
  }

  return (
    <Box component="nav">
      <List
        sx={{ display: 'flex', height: 1 }}
        disablePadding>
        <ListItem
          disablePadding
          sx={{ display: { xs: 'none', md: 'flex' } }}>
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

        <ListItem disablePadding>
          <DividerUpperNavbarOptions />
          <CartDrawer />
        </ListItem>

        <ListItem
          disablePadding
          sx={{ display: { xs: 'none', md: 'flex' } }}>
          {cartItems.length > 0 ? (
            <>
              <DividerUpperNavbarOptions />
              <Box sx={{ padding: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 1 }}>
                <CheckoutButton
                  label="checkout"
                  sxStyles={{ height: '30px', minHeight: '30px' }}
                />
              </Box>
            </>
          ) : null}
        </ListItem>

        <ListItem
          disablePadding
          sx={{ display: { xs: 'none', md: 'flex' } }}>
          <DividerUpperNavbarOptions />
          <AccountDropdownMenu />
          <DividerUpperNavbarOptions />
        </ListItem>
      </List>
    </Box>
  );
}
