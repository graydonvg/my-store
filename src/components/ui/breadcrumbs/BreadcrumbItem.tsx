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
  const shippingDetails = useAppSelector((state) => state.checkoutData.shippingDetails);
  let labelHoverColor = null;

  // Payment breadcrumb: Change label color on hover if address IS selected.
  // Other breadcrumbs: Change label color on hover if path is NOT selected.
  if (label === 'payment' && !!shippingDetails) {
    labelHoverColor = customColorPalette.typographyVariants.white;
  } else if (label !== 'payment' && pathname !== href) {
    labelHoverColor = customColorPalette.typographyVariants.white;
  }

  return (
    <Link
      onClick={onLinkClick}
      href={href}
      tabIndex={-1}>
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
              color: labelHoverColor,
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
