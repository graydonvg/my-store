'use client';

import { ListItem, useTheme } from '@mui/material';
import LowerNavbarDropdownMenuItem from './LowerNavbarDropdownMenuItem';
import HoverDropdownMenu from '@/components/ui/HoverDropdownMenu';

type LowerNavbarDropdownMenuProps = {
  path: string;
  label: string;
};

const lowerNavbarMenuOptions = ['T-Shirts', 'Pants', 'Shoes', 'Hats', 'Socks'];

export default function LowerNavbarDropdownMenu({ path, label }: LowerNavbarDropdownMenuProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelTextColor = mode === 'light' ? 'custom.grey.medium' : 'custom.grey.light';
  const menuOffsetBoxBackgroundColor = mode === 'light' ? 'custom.grey.light' : 'custom.grey.medium';
  const labelTextColorOnHover = mode === 'light' ? 'custom.grey.dark' : 'custom.grey.light';

  return (
    <ListItem disablePadding>
      <HoverDropdownMenu
        menuOffsetBoxHeight={'9.7px'}
        menuOffsetBoxBackgroundColor={menuOffsetBoxBackgroundColor}
        menuAnchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        menuTransformOrigin={{ vertical: 'top', horizontal: 'center' }}
        labelTextColor={labelTextColor}
        labelTextColorOnHover={labelTextColorOnHover}
        labelTextUnderlineColorOnHover={labelTextColorOnHover}
        labelContent={label}
        labelPaddingX={2}>
        {lowerNavbarMenuOptions.map((item, index) => (
          <LowerNavbarDropdownMenuItem
            key={index}
            menuItemText={item}
          />
        ))}
      </HoverDropdownMenu>
    </ListItem>
  );
}
