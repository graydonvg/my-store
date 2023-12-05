'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSXElementConstructor, ReactElement, cloneElement } from 'react';

type Props = {
  href: string;
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
  label: string;
};

export default function BreadcrumbItem({ href, icon, label }: Props) {
  const theme = useTheme();
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const customColorPalette = useCustomColorPalette();

  return (
    <Link href={href}>
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
