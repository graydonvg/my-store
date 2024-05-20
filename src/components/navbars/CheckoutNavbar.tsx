import { AppBar, Box } from '@mui/material';
import CommonNavbarContainer from '../ui/containers/CommonNavbarContainer';
import { ElevationScroll } from '../ui/ElevationScroll';
import NavbarTitle from './NavbarTitle';
import ThemeToggleButton from '../theme/ThemeToggleButton';
import BreadcrumbsComponent from '../checkoutFlow/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '../checkoutFlow/breadcrumbs/BreadcrumbItem';
import { LocalShippingOutlined, Payment, ShoppingCart, ThumbUp } from '@mui/icons-material';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'shipping' },
  { href: '', icon: <Payment />, label: 'payment' },
  { href: '/checkout/payment/confirmation', icon: <ThumbUp />, label: 'confirmation' },
];

export default function CheckoutNavbar() {
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
                height: '50px',
              }}>
              <NavbarTitle
                component="h3"
                variant="h5"
                color={(theme) => theme.palette.custom.navbar.upper.text}
                showOnSmallScreen={true}
              />
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'end', alignItems: 'center', paddingRight: '4px' }}>
                <ThemeToggleButton
                  edge="end"
                  size="medium"
                />
              </Box>
            </Box>
          </CommonNavbarContainer>
        </Box>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.custom.navbar.lower.background : theme.palette.common.white,
          }}>
          <CommonNavbarContainer>
            <Box
              component="nav"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
                position: 'relative',
                minHeight: '48px',
                height: 'fit-content',
                paddingY: 1,
              }}>
              <BreadcrumbsComponent>
                {breadcrumbData.map((item, index) => (
                  <BreadcrumbItem
                    key={index}
                    {...item}
                  />
                ))}
              </BreadcrumbsComponent>
            </Box>
          </CommonNavbarContainer>
        </Box>
      </AppBar>
    </ElevationScroll>
  );
}
