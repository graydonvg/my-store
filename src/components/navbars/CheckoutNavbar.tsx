'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavbarTitleAndLogo from '../ui/NavbarTitleAndLogo';
import BreadcrumbsComponent from '../ui/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '../ui/breadcrumbs/BreadcrumbItem';
import { LocalShippingOutlined, Payment, ShoppingCart } from '@mui/icons-material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import PaymentButton from '../ui/buttons/PaymentButton';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'shipping' },
];

export default function CheckoutNavbar() {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ backgroundColor: customColorPalette.navBar.upper.background }}>
      <CommonNavbarContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: { xs: '64px', md: '48px' },
          }}>
          <NavbarTitleAndLogo
            hideText={isBelowSmall ? true : false}
            variant="h5"
            display="flex"
            color={customColorPalette.navBar.upper.text}
          />
          <Box sx={{ margin: '0 auto' }}>
            <BreadcrumbsComponent>
              {breadcrumbData.map((item, index) => (
                <BreadcrumbItem
                  key={index}
                  {...item}
                />
              ))}
              <PaymentButton showBreadcrumbButton={true} />
            </BreadcrumbsComponent>
          </Box>
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
