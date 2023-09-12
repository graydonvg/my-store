'use client';

import { MenuItem, ListItemIcon, Tooltip, useMediaQuery, useTheme, Typography, Box } from '@mui/material';
import { ViewList, Logout, ArrowDropDown, AccountCircle } from '@mui/icons-material';
import { ThemeToggle } from './Theme/ThemeToggle';
import { signOutUser } from '@/lib/firebase';
import { useAppSelector } from '@/lib/redux/hooks';
import { dropdownMenuItemStyles, upperNavbarOptions } from '@/lib/styles';

const accountMenuOptions = ['My Account', 'Orders', 'Sign Out'];

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
                <MenuItem sx={dropdownMenuItemStyles}>
                  <ListItemIcon>
                    <AccountCircle
                      fontSize="small"
                      sx={{ color: 'dropdownMenu.icon' }}
                    />
                  </ListItemIcon>
                  My account
                </MenuItem>
                <MenuItem sx={dropdownMenuItemStyles}>
                  <ListItemIcon>
                    <ViewList
                      fontSize="small"
                      sx={{ color: 'dropdownMenu.icon' }}
                    />
                  </ListItemIcon>
                  Orders
                </MenuItem>
                <ThemeToggle />
                <MenuItem
                  onClick={handleSignOut}
                  sx={dropdownMenuItemStyles}>
                  <ListItemIcon>
                    <Logout
                      fontSize="small"
                      sx={{ color: 'dropdownMenu.icon' }}
                    />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </>
            }>
            <Box
              component="button"
              sx={upperNavbarOptions}>
              <Typography
                component="span"
                sx={{
                  color: 'dropdownMenu.text',
                }}>
                {(currenUser && firstName) ?? 'Account'}
              </Typography>
              <ArrowDropDown sx={{ color: 'upperNavbar.secondaryIcon' }} />
            </Box>
          </Tooltip>
        </>
      ) : null}
    </>
  );
}
