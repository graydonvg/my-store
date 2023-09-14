'use client';

import { Tooltip, useMediaQuery, useTheme, Typography, MenuItem, ListItemIcon, Button, Menu } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout } from '@mui/icons-material';
import { ThemeIcon } from './ui/ThemeIcon';
import { signOutUser } from '@/lib/firebase';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import UpperNavbarOptionsContainer from './Navbar/UpperNavbarOptionsContainer';
import CustomButton from './ui/CustomButton';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import DropdownMenu from './DropdownMenu';
import { useState } from 'react';

const menuItemStyles = {
  color: 'dropdownMenu.text',
  '&:hover': { backgroundColor: 'dropdownMenu.hover' },
};
const iconColor = 'dropdownMenu.icon';
const iconSize = 'small';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const firstName = currenUser?.displayName.split(' ')[0] ?? null;

  function changeTheme() {
    dispatch(toggleTheme());
  }

  function handleSignOut() {
    signOutUser();
  }

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  let timeoutId: NodeJS.Timeout | null = null;

  const handleClose = () => {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuEnter = () => {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <>
      {!isBelowMedium ? (
        <>
          <Button
            disableTouchRipple
            sx={{
              display: 'flex',
              whiteSpace: 'nowrap',
              margin: 0,
              '&:hover': { backgroundColor: 'upperNavbar.background' },
              paddingX: 2,
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
            onClick={handleOpen}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}>
            <Typography
              component="span"
              sx={{
                textTransform: 'none',
                color: 'upperNavbar.text',
              }}>
              {(currenUser && firstName) ?? 'Account'}
            </Typography>
            <ArrowDropDown sx={{ color: 'upperNavbar.secondaryIcon', marginLeft: 2 }} />
          </Button>
          <Menu
            elevation={0}
            sx={{
              '& .MuiMenu-paper': {
                padding: 1,
                backgroundColor: 'upperNavbar.background',
                maxWidth: 220,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            disablePortal
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              onMouseLeave: handleMenuClose,
              onMouseEnter: handleMenuEnter,
            }}>
            <MenuItem
              sx={menuItemStyles}
              onClick={changeTheme}>
              <ListItemIcon>
                <ThemeIcon
                  color={iconColor}
                  size={iconSize}
                />
              </ListItemIcon>
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </MenuItem>
            <MenuItem sx={menuItemStyles}>
              <ListItemIcon>
                <AccountCircle
                  fontSize={iconSize}
                  sx={{ color: iconColor }}
                />
              </ListItemIcon>
              My Account
            </MenuItem>
            <MenuItem sx={menuItemStyles}>
              <ListItemIcon>
                <ViewList
                  fontSize={iconSize}
                  sx={{ color: iconColor }}
                />
              </ListItemIcon>
              Orders
            </MenuItem>
            <MenuItem
              sx={menuItemStyles}
              onClick={handleSignOut}>
              <ListItemIcon>
                <Logout
                  fontSize={iconSize}
                  sx={{ color: iconColor }}
                />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </>
      ) : null}
    </>
  );
}
