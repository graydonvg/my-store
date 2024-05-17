import { AppBar, Box } from '@mui/material';
import BreadcrumbsComponent from '../ui/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '../ui/breadcrumbs/BreadcrumbItem';
import { LocalShippingOutlined, ShoppingCart } from '@mui/icons-material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import PaymentButton from '../checkoutFlow/PaymentButton';
import { ElevationScroll } from '../ui/ElevationScroll';
import NavbarTitle from './NavbarTitle';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'shipping' },
];

export default function NavbarCheckout() {
  return (
    <ElevationScroll>
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky">
        <Box sx={{ backgroundColor: (theme) => theme.palette.custom.navbar.upper.background }}>
          <CommonNavbarContainer>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '64px',
              }}>
              <NavbarTitle
                component="h3"
                variant="h5"
                color={(theme) => theme.palette.custom.navbar.upper.text}
                showOnSmallScreen={false}
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
                  <PaymentButton buttonVariant="breadcrumb" />
                </BreadcrumbsComponent>
              </Box>
            </Box>
          </CommonNavbarContainer>
        </Box>
      </AppBar>
    </ElevationScroll>
  );
}
