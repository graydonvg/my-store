'use client';

import { Fragment, MouseEvent, useState } from 'react';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from '@mui/material';
import { PersonAdd, Settings, Logout, AdminPanelSettings, Store } from '@mui/icons-material';
import { ThemeToggle } from './ThemeToggle/ThemeToggle';

type AccountMenuProps = {
  user: { role?: string };
  isAdminView: boolean;
};

export default function AccountMenu({ user, isAdminView }: AccountMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip
        title="Account settings"
        arrow>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ display: { xs: 'none', md: 'block' } }}>
          <Avatar>M</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        sx={{ display: { xs: 'none', md: 'block' } }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        {user.role === 'admin' ? (
          isAdminView ? (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Store fontSize="small" />
              </ListItemIcon>
              Store view
            </MenuItem>
          ) : (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small" />
              </ListItemIcon>
              Admin panel
            </MenuItem>
          )
        ) : null}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <ThemeToggle />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
