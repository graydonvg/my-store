import { MenuItem } from '@mui/material';

type LowerNavbarOptionMenuItemProps = {
  menuItemText: string;
};

export default function LowerNavbarOptionMenuItem({ menuItemText }: LowerNavbarOptionMenuItemProps) {
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
