import { Box } from '@mui/material';
import { LocalShippingOutlined, Payment, ShoppingCart, ThumbUp } from '@mui/icons-material';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';
import BreadcrumbsComponent from '@/components/checkoutFlow/breadcrumbs/BreadcrumbsComponent';
import BreadcrumbItem from '@/components/checkoutFlow/breadcrumbs/BreadcrumbItem';

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
            {breadcrumbData.map((item) => (
              <BreadcrumbItem
                key={item.label}
                {...item}
              />
            ))}
          </BreadcrumbsComponent>
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
