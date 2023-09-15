import { MenuItem } from '@mui/material';

type LowerNavbarDropdownMenuItemProps = {
  menuItemText: string;
};

export default function LowerNavbarDropdownMenuItem({ menuItemText }: LowerNavbarDropdownMenuItemProps) {
  return (
    <MenuItem
      sx={{
        color: 'dropdownMenu.text',
        '&:hover': { backgroundColor: 'dropdownMenu.hover' },
      }}>
      {menuItemText}
    </MenuItem>
  );
}
