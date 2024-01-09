'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';

type Props = {
  href: string;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  label: string;
  onLinkClick?: () => void;
};

export default function BreadcrumbItem({ href, icon, label, onLinkClick }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const customColorPalette = useCustomColorPalette();
  const { shippingDetails, isProcessing } = useAppSelector((state) => state.checkoutData);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const isPointerEventsDisabled =
    (label === 'payment' && !shippingDetails) ||
    (label === 'shipping' && cartItems.length === 0) ||
    isProcessing === true;

  return (
    <Link
      onClick={onLinkClick}
      href={href !== '/checkout/payment' ? href : ''}
      tabIndex={-1}
      style={{
        pointerEvents: isPointerEventsDisabled ? 'none' : 'auto',
      }}>
      <Button
        disableTouchRipple
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          color: pathname === href ? customColorPalette.primary.light : customColorPalette.shade.medium,
          '&.MuiButton-root': {
            minWidth: { xs: 'unset', sm: '64px' },
          },
          '@media (hover: hover)': {
            '&:hover': {
              color: pathname === href ? customColorPalette.primary.light : customColorPalette.navBar.upper.text,
              backgroundColor: customColorPalette.navBar.upper.background,
            },
          },
        }}>
        {cloneElement(icon, { sx: { mr: 1 }, fontSize: 'small' })}
        {!isBelowSmall ? (
          <Typography
            textTransform="uppercase"
            fontSize={14}
            fontWeight={600}>
            {label}
          </Typography>
        ) : null}
      </Button>
    </Link>
  );
}
