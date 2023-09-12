import { dropdownMenuItemStyles, lowerNavbarButtonStyles } from '@/lib/styles';
import { Button, Tooltip, Typography, MenuItem } from '@mui/material';
import Link from 'next/link';

type NavbarOptionMenuProps = {
  path: string;
  label: string;
};

export default function NavbarOptionMenu({ path, label }: NavbarOptionMenuProps) {
  return (
    <Tooltip
      arrow
      slotProps={{
        arrow: {
          sx: {
            color: 'upperNavbar.background',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            padding: 1,
            backgroundColor: 'upperNavbar.background',
            maxWidth: 220,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        },
      }}
      title={
        <>
          <MenuItem sx={dropdownMenuItemStyles}>T-Shirts</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Pants</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Shoes</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Hats</MenuItem>
          <MenuItem sx={dropdownMenuItemStyles}>Socks</MenuItem>
        </>
      }>
      <Button sx={{ ...lowerNavbarButtonStyles }}>{label}</Button>
    </Tooltip>
  );
}
