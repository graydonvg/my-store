import { Box } from '@mui/material';
import CommonNavbarContainer from '../../ui/containers/CommonNavbarContainer';
import BreadcrumbsComponent from '../../checkoutFlow/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '../../checkoutFlow/breadcrumbs/BreadcrumbItem';
import { LocalShippingOutlined, Payment, ShoppingCart, ThumbUp } from '@mui/icons-material';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'shipping' },
  { href: '', icon: <Payment />, label: 'payment' },
  { href: '/checkout/payment/confirmation', icon: <ThumbUp />, label: 'confirmation' },
];

export default function LowerCheckoutNavbar() {
  return (
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
  );
}
