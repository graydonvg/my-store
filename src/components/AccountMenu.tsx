'use client';

import { Tooltip, useMediaQuery, useTheme, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { ThemeToggle } from './Theme/ThemeToggle';
import { signOutUser } from '@/lib/firebase';
import { useAppSelector } from '@/lib/redux/hooks';
import UpperNavbarOptionsContainer from './Navbar/UpperNavbarOptionsContainer';
import DropdownMenuItem from './ui/DropdownMenuItem';

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
                <ThemeToggle />
                {accountMenuOptions.map((option, index) => (
                  <DropdownMenuItem
                    key={index}
                    showIcons={true}
                    menuItemText={option}
                  />
                ))}
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
