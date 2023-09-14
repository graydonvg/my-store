'use client';

import { Button, Menu, MenuProps, PopoverOrigin } from '@mui/material';
import { ReactNode, useState } from 'react';

type HoverDropdownMenuProps = {
  children: ReactNode;
  btnLabel: ReactNode;
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  btnHoverBackgroundColor: string;
  btnTextColor?: string;
  btnPaddingX?: string;
};

export default function HoverDropdownMenu({
  children,
  btnLabel,
  anchorOrigin,
  transformOrigin,
  btnHoverBackgroundColor,
  btnTextColor,
  btnPaddingX,
}: HoverDropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    !open ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
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
      <Button
        tabIndex={0}
        disableTouchRipple
        sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          color: btnTextColor,
          margin: 0,
          '&:hover': { backgroundColor: btnHoverBackgroundColor },
          btnPaddingX,
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}>
        {btnLabel}
      </Button>
      <Menu
        elevation={0}
        sx={{
          '& .MuiMenu-paper': {
            padding: 1,
            paddingTop: 0,
            backgroundColor: 'upperNavbar.background',
            maxWidth: 220,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        disablePortal
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
          onMouseEnter: handleMenuEnter,
        }}>
        {children}
      </Menu>
    </>
  );
}
