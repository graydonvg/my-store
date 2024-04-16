import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import CartDrawer from '../../../drawers/cartDrawer/CartDrawer';
import AccountDropdownMenu from '@/components/accountDropdownMenu/AccountDropdownMenu';
import { Favorite } from '@mui/icons-material';
import UpperNavbarIconButton from '@/components/navbars/upperNavbar/UpperNavbarIconButton';
import CheckoutButton from '@/components/ui/buttons/CheckoutButton';
import DividerUpperNavbarOptions from './DividerUpperNavbarOptions';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';

export default function UserSignedInUpperNavbarOptions() {
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin');

  function navigateToWishlist() {
    router.push('/wishlist');
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
              onClick={navigateToWishlist}
              backgroundColor={theme.palette.custom.navBar.upper.background}>
              <Typography
                component="span"
                fontSize={16}
                sx={{ color: theme.palette.custom.typographyVariants.white, marginLeft: 1 }}>
                Wishlist
              </Typography>
              <Favorite
                aria-label="Wishlist"
                sx={{ color: theme.palette.custom.typographyVariants.white, opacity: '50%', marginLeft: 1 }}
              />
            </UpperNavbarIconButton>
          </ListItem>
        ) : null}

        {!isAdminView ? (
          <ListItem disablePadding>
            <DividerUpperNavbarOptions />
            <CartDrawer />
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ThemeToggleButton />
          </ListItem>
        )}

        {!isBelowMedium && cartItems.length > 0 ? (
          <>
            <ListItem disablePadding>
              <DividerUpperNavbarOptions />
              <Box sx={{ padding: 0.5 }}>
                <CheckoutButton
                  height="30px"
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
