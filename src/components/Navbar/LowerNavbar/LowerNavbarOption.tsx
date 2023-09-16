'use client';

import { ListItem, Typography, useTheme } from '@mui/material';
import LowerNavbarOptionMenuItem from './LowerNavbarOptionMenuItem';
import HoverDropdownMenu from '@/components/ui/HoverDropdownMenu';

type LowerNavbarOptionProps = {
  path: string;
  label: string;
};

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarOption({ path, label }: LowerNavbarOptionProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const menuOffsetBoxBackgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.medium';

  return (
    <ListItem
      disablePadding
      disableGutters>
      <HoverDropdownMenu
        menuOffsetBoxHeight={'8px'}
        menuOffsetBoxBackgroundColor={menuOffsetBoxBackgroundColor}
        menuAnchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        menuTransformOrigin={{ vertical: 'top', horizontal: 'center' }}
        labelContent={
          <Typography
            component="span"
            sx={{
              textTransform: 'none',
              color: labelTextColor,
              '&:hover': {
                color: 'custom.grey.dark',
                textDecoration: 'underline',
                textDecorationColor: 'custom.grey.dark',
                textDecorationThickness: 1,
                textUnderlineOffset: 6,
              },
            }}>
            {label}
          </Typography>
        }>
        {lowerNavbarMenuOptions.map((item, index) => (
          <LowerNavbarOptionMenuItem
            key={index}
            menuItemText={item}
          />
        ))}
      </HoverDropdownMenu>
    </ListItem>
  );
}
