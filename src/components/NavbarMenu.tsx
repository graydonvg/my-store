import { navbarButtonStyles } from '@/lib/styles';
import { Button, Tooltip, Typography, MenuItem } from '@mui/material';
import Link from 'next/link';

type NavbarMenuProps = {
  path: string;
  label: string;
};

export default function NavbarMenu({ path, label }: NavbarMenuProps) {
  return (
    <Tooltip
      arrow
      slotProps={{
        arrow: {
          sx: {
            color: 'navbarUpper.background',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -6.2],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            padding: 1,
            backgroundColor: 'navbarUpper.background',
            maxWidth: 220,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        },
      }}
      title={
        <>
          <MenuItem
            sx={{ color: 'navbarLower.menuItemText', '&:hover': { backgroundColor: 'navbarLower.menuItemHover' } }}>
            T-Shirts
          </MenuItem>
          <MenuItem
            sx={{ color: 'navbarLower.menuItemText', '&:hover': { backgroundColor: 'navbarLower.menuItemHover' } }}>
            Pants
          </MenuItem>
          <MenuItem
            sx={{ color: 'navbarLower.menuItemText', '&:hover': { backgroundColor: 'navbarLower.menuItemHover' } }}>
            Shoes
          </MenuItem>
          <MenuItem
            sx={{ color: 'navbarLower.menuItemText', '&:hover': { backgroundColor: 'navbarLower.menuItemHover' } }}>
            Hats
          </MenuItem>
          <MenuItem
            sx={{ color: 'navbarLower.menuItemText', '&:hover': { backgroundColor: 'navbarLower.menuItemHover' } }}>
            Socks
          </MenuItem>
        </>
      }>
      <Button sx={{ ...navbarButtonStyles, color: 'navbarLower.text' }}>{label}</Button>
    </Tooltip>
  );
}
