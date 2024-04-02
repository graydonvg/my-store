import { Box, useMediaQuery, useTheme } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import NavbarTitle from '../ui/NavbarTitle';
import BreadcrumbsComponent from '../ui/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '../ui/breadcrumbs/BreadcrumbItem';
import { LocalShippingOutlined, ShoppingCart } from '@mui/icons-material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import PaymentButton from '../ui/buttons/PaymentButton';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'shipping' },
];

export default function CheckoutNavbar() {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ backgroundColor: colorPalette.navBar.upper.background }}>
      <CommonNavbarContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: { xs: '64px', md: '48px' },
          }}>
          <NavbarTitle
            hideText={isBelowSmall ? true : false}
            variant="h5"
            display="flex"
            color={colorPalette.navBar.upper.text}
          />
          <Box
            sx={{ margin: '0 auto' }}
            component="nav">
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
