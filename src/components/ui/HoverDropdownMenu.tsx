'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { Box, Menu } from '@mui/material';
import { ReactNode, useState } from 'react';
import UpperNavbarIconButton from '../navbars/upperNavbar/UpperNavbarIconButton';

type Props = {
  buttonBackgroundColor: string;
  children: ReactNode;
  label: ReactNode;
};

export default function HoverDropdownMenu({ buttonBackgroundColor, children, label }: Props) {
  const colorPalette = useColorPalette();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let timeoutId: NodeJS.Timeout | null = null;

  function handleMenuOpen(event: React.MouseEvent<HTMLDivElement>) {
    !open ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
  }

  function handleMenuCloseAfterTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setAnchorEl(null);
    }, 0);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleMenuEnter() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  return (
    <>
      <Box
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        onClick={handleMenuOpen}
        onMouseEnter={handleMenuOpen}
        onMouseLeave={handleMenuCloseAfterTimeout}>
        <UpperNavbarIconButton backgroundColor={buttonBackgroundColor}>{label}</UpperNavbarIconButton>
      </Box>
      <Menu
        disableScrollLock
        elevation={0}
        sx={{
          '& .MuiMenu-list': {
            padding: 0,
          },
          '& .MuiMenu-paper': {
            backgroundColor: colorPalette.navBar.upper.background,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: 'visible',
          },
        }}
        disablePortal={true}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
          onMouseEnter: handleMenuEnter,
        }}>
        <Box
          tabIndex={-1}
          sx={{ padding: 1 }}>
          {children}
        </Box>
      </Menu>
    </>
  );
}
