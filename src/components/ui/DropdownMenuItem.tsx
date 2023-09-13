'use client';

import { MenuItem, ListItemIcon } from '@mui/material';
import { AccountCircle, ViewList, Logout } from '@mui/icons-material';

type DropdownMenuItemProps = {
  showIcons: boolean;
  menuItemText: string;
};

const iconColor = 'dropdownMenu.icon';

export default function DropdownMenuItem({ menuItemText, showIcons }: DropdownMenuItemProps) {
  return (
    <MenuItem
      sx={{
        color: 'dropdownMenu.text',
        '&:hover': { backgroundColor: 'dropdownMenu.hover' },
      }}>
      {showIcons && (
        <ListItemIcon>
          {menuItemText === 'My Account' ? (
            <AccountCircle
              fontSize="small"
              sx={{ color: iconColor }}
            />
          ) : menuItemText === 'Orders' ? (
            <ViewList
              fontSize="small"
              sx={{ color: iconColor }}
            />
          ) : menuItemText === 'Sign Out' ? (
            <Logout
              fontSize="small"
              sx={{ color: iconColor }}
            />
          ) : null}
        </ListItemIcon>
      )}
      {menuItemText}
    </MenuItem>
  );
}
