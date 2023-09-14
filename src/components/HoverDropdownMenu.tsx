'use client';

import { MouseEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Menu } from '@mui/material';
import CustomButton from './ui/CustomButton';

const HoverDropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  let timeoutId: NodeJS.Timeout | null = null;

  const handleClose = () => {
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setAnchorEl(null);
    }, 0);
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
      <CustomButton
        color="error"
        hoverBackgroundColor="upperNavbar.background"
        sx={{ zIndex: 1 }}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}>
        Hover Me
      </CustomButton>
      <Menu
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
          onMouseEnter: handleMenuEnter,
        }}>
        <MenuItem>Hi</MenuItem>
        <MenuItem>Hello</MenuItem>
        <MenuItem>Bye</MenuItem>
      </Menu>
    </>
  );
};

export default HoverDropdownMenu;
