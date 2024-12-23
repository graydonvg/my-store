'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem } from '@mui/material';
import CartDrawer from '../../../../../drawers/cartDrawer/CartDrawer';
import CheckoutButton from '@/components/CheckoutButton';
import DividerUpperNavbarOptions from '../DividerUpperNavbarOptions';
import CartDrawerButton from './CartDrawerButton';
import WishlistButton from './WishlistButton';
import AccountDropdownMenu from './accountDropdownMenu/AccountDropdownMenu';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';

export default function AuthenticatedUpperNavbarOptions() {
  const cartItems = useAppSelector(selectCartItems);

  return (
    <Box
      component="nav"
      sx={{ height: 1 }}>
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
              <Box sx={{ paddingX: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 1 }}>
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
