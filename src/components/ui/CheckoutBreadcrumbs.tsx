'use client';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import { LocalShippingOutlined, NavigateNext, Payment, ShoppingCart } from '@mui/icons-material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { JSXElementConstructor, MouseEvent, ReactElement, cloneElement } from 'react';
import { usePathname } from 'next/navigation';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

const breadcrumbData = [
  { href: '/cart/view', icon: <ShoppingCart />, label: 'Cart' },
  { href: '/checkout/shipping', icon: <LocalShippingOutlined />, label: 'Shipping' },
  { href: '/checkout/payment', icon: <Payment />, label: 'Payment' },
];

function BreadcrumbItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  label: string;
}) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const customColorPalette = useCustomColorPalette();

  return (
    <Link
      href={href}
      style={{}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: pathname === href ? customColorPalette.blue.light : customColorPalette.grey.medium,
          '@media (hover: hover)': {
            '&:hover': {
              color: pathname !== href ? customColorPalette.grey.light : null,
            },
          },
        }}>
        {icon && cloneElement(icon, { sx: { mr: 1 }, fontSize: 'small' })}
        {!isBelowSmall && (
          <Typography
            textTransform="uppercase"
            fontSize={14}
            fontWeight={600}>
            {label}
          </Typography>
        )}
      </Box>
    </Link>
  );
}

export default function CheckoutBreadcrumbs() {
  const customColor = useCustomColorPalette();

  return (
    <Box role="presentation">
      <Breadcrumbs
        separator={
          <NavigateNext
            fontSize="large"
            sx={{ color: customColor.grey.medium }}
          />
        }
        aria-label="breadcrumb">
        {breadcrumbData.map((item, index) => (
          <BreadcrumbItem
            key={index}
            {...item}
          />
        ))}
      </Breadcrumbs>
    </Box>
  );
}
