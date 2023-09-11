'use client';

import { MouseEvent, useEffect, useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import { PersonAdd, Settings, Logout, AdminPanelSettings, Store, ArrowDropDown } from '@mui/icons-material';
import { ThemeToggle } from './Theme/ThemeToggle';
import { signOutUser } from '@/lib/firebase';
import { useAppSelector } from '@/lib/redux/hooks';

type AccountMenuProps = {
  userRole: { role: string };
  isAdminView: boolean;
};

export default function AccountMenu({ userRole, isAdminView }: AccountMenuProps) {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const firstName = currenUser?.displayName.split(' ')[0] ?? null;

  useEffect(() => {
    isBelowMedium ? handleClose() : null;
  }, [isBelowMedium]);

  function handleOpen(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSignOut() {
    signOutUser();
  }

  return (
    <>
      {!isBelowMedium ? (
        <>
          <Tooltip
            title="Account settings"
            arrow
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10],
                  },
                },
              ],
            }}>
            <Button
              disableTouchRipple
              onMouseOver={handleOpen}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ display: 'flex', gap: 1, textTransform: 'unset' }}>
              <Typography
                component="span"
                sx={{
                  color: 'navbar.text',
                }}>
                {(currenUser && firstName) ?? 'Account'}
              </Typography>
              <ArrowDropDown sx={{ color: 'navbar.text' }} />
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            MenuListProps={{ onMouseLeave: handleClose }}
            sx={{ marginRight: 20 }}
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
                    right: 15,
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
            {currenUser && userRole.role === 'admin' ? (
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
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </>
      ) : null}
    </>
  );
}
