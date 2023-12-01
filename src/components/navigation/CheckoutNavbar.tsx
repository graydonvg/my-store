'use client';

import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import NavbarTitleAndLogo from '../ui/NavbarTitleAndLogo';
import BreadcrumbsComponent from '../ui/BreadcrumbsComponent';
import BreadcrumbItem from '../ui/BreadcrumbItem';
import { LocalShippingOutlined, Payment, ShoppingCart } from '@mui/icons-material';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'Cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'Shipping' },
  { href: '/checkout/payment', icon: <Payment />, label: 'Payment' },
];

export default function CheckoutNavbar() {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ backgroundColor: customColorPalette.grey.dark }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: { xs: '64px', md: '40px' },
            flexGrow: 1,
            gap: 2,
          }}>
          <NavbarTitleAndLogo
            hideText={isBelowSmall ? true : false}
            variant="h5"
            display="flex"
            color={customColorPalette.grey.light}
          />
          <Box sx={{ margin: '0 auto' }}>
            <BreadcrumbsComponent>
              {breadcrumbData.map((item, index) => (
                <BreadcrumbItem
                  key={index}
                  {...item}
                />
              ))}
            </BreadcrumbsComponent>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
