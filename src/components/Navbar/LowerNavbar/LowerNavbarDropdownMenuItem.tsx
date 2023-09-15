import { MenuItem } from '@mui/material';

type LowerNavbarDropdownMenuItemProps = {
  menuItemText: string;
};

export default function LowerNavbarDropdownMenuItem({ menuItemText }: LowerNavbarDropdownMenuItemProps) {
  return (
    <MenuItem
      disableRipple
      sx={{
        padding: 0,
        marginX: 2,
        marginY: '6px',
        cursor: 'default',
        color: 'custom.grey.light',
        '&:hover': { backgroundColor: 'custom.grey.dark', color: 'custom.blue.light' },
      }}>
      {/* make this a link. no need for cursor: 'pointer' */}
      {menuItemText}
    </MenuItem>
  );
}
