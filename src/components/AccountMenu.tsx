'use client';

import { Tooltip, useMediaQuery, useTheme, Typography, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowDropDown, AccountCircle, ViewList, Logout } from '@mui/icons-material';
import { ThemeToggle } from './Theme/ThemeToggle';
import { signOutUser } from '@/lib/firebase';
import { useAppSelector } from '@/lib/redux/hooks';
import UpperNavbarOptionsContainer from './Navbar/UpperNavbarOptionsContainer';

const menuItemStyles = {
  color: 'dropdownMenu.text',
  '&:hover': { backgroundColor: 'dropdownMenu.hover' },
};
const iconColor = 'dropdownMenu.icon';
const iconSize = 'small';

export default function AccountMenu() {
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const firstName = currenUser?.displayName.split(' ')[0] ?? null;

  function handleSignOut() {
    signOutUser();
  }

  return (
    <>
      {!isBelowMedium ? (
        <>
          <Tooltip
            placement="bottom-end"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -13.61],
                    },
                  },
                ],
              },
              tooltip: {
                sx: {
                  padding: 1,
                  backgroundColor: 'dropdownMenu.background',
                  maxWidth: 220,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              },
            }}
            title={
              <>
                <ThemeToggle />
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
              </>
            }>
            <UpperNavbarOptionsContainer>
              <Typography
                component="span"
                sx={{
                  color: 'dropdownMenu.text',
                }}>
                {(currenUser && firstName) ?? 'Account'}
              </Typography>
              <ArrowDropDown sx={{ color: 'upperNavbar.secondaryIcon' }} />
            </UpperNavbarOptionsContainer>
          </Tooltip>
        </>
      ) : null}
    </>
  );
}
