import { Box, Menu, menuClasses } from '@mui/material';
import { ReactNode, useState } from 'react';
import UpperNavbarIconButton from '../navbars/navbarStorefront/upperNavbar/UpperNavbarIconButton';

type Props = {
  buttonBackgroundColor: string;
  children: ReactNode;
  label: ReactNode;
};

export default function HoverDropdownMenu({ buttonBackgroundColor, children, label }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let timeoutId: NodeJS.Timeout | null = null;

  function handleMenuOpen(event: React.MouseEvent<HTMLDivElement>) {
    !open ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
  }

  function closeMenuAfterTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setAnchorEl(null);
    }, 0);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function clearTimeoutOnMenuEnter() {
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
        onMouseLeave={closeMenuAfterTimeout}>
        <UpperNavbarIconButton backgroundColor={buttonBackgroundColor}>{label}</UpperNavbarIconButton>
      </Box>
      <Menu
        disableScrollLock
        elevation={0}
        sx={{
          [`& .${menuClasses.list}`]: { padding: 0 },
          [`& .${menuClasses.paper}`]: {
            backgroundColor: (theme) => theme.palette.custom.navbar.upper.background,
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
        onClose={closeMenu}
        MenuListProps={{
          onMouseLeave: closeMenu,
          onMouseEnter: clearTimeoutOnMenuEnter,
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
