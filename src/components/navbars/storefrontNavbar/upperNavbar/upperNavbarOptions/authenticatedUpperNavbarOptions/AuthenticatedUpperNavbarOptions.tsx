'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem } from '@mui/material';
import CartDrawer from '../../../../../drawers/cartDrawer/CartDrawer';
import CheckoutButton from '@/components/ui/buttons/complex/CheckoutButton';
import DividerUpperNavbarOptions from '../DividerUpperNavbarOptions';
import CartDrawerButton from './CartDrawerButton';
import WishlistButton from './WishlistButton';
import AccountDropdownMenu from './accountDropdownMenu/AccountDropdownMenu';

export default function AuthenticatedUpperNavbarOptions() {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <Box component="nav">
      <List
        sx={{ display: 'flex', height: 1 }}
        disablePadding>
        <ListItem
          disablePadding
          sx={{ display: { xs: 'none', md: 'flex' } }}>
          <DividerUpperNavbarOptions />
          <WishlistButton />
        </ListItem>

        <ListItem disablePadding>
          <DividerUpperNavbarOptions />
          <CartDrawerButton />
          <CartDrawer />
        </ListItem>

        {cartItems.length > 0 ? (
          <ListItem
            disablePadding
            sx={{ display: { xs: 'none', md: 'flex' } }}>
            <>
              <DividerUpperNavbarOptions />
              <Box sx={{ padding: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 1 }}>
                <CheckoutButton
                  label="checkout"
                  sxStyles={{ height: '30px', minHeight: '30px' }}
                />
              </Box>
            </>
          </ListItem>
        ) : null}

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
