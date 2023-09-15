'use client';

import { Box, Button, Menu, PopoverOrigin } from '@mui/material';
import { ReactNode, useState } from 'react';

type HoverDropdownMenuProps = {
  children: ReactNode;
  menuOffsetBoxHeight?: string;
  menuOffsetBoxBackgroundColor?: string;
  menuAnchorOrigin: PopoverOrigin;
  menuTransformOrigin: PopoverOrigin;
  btnLabel: ReactNode;
  btnTextColor?: string;
  btnPaddingX?: number;
  btnHoverBackgroundColor: string;
};

export default function HoverDropdownMenu({
  children,
  menuOffsetBoxHeight,
  menuOffsetBoxBackgroundColor,
  menuAnchorOrigin,
  menuTransformOrigin,
  btnLabel,
  btnTextColor,
  btnPaddingX,
  btnHoverBackgroundColor,
}: HoverDropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let timeoutId: NodeJS.Timeout | null = null;

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    !open ? setAnchorEl(event.currentTarget) : setAnchorEl(null);
  }

  function handleClose() {
    if (!!timeoutId) {
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
    if (!!timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  return (
    <>
      <Button
        disableTouchRipple
        sx={{
          height: 1,
          display: 'flex',
          whiteSpace: 'nowrap',
          color: btnTextColor,
          margin: 0,
          '&:hover': { backgroundColor: btnHoverBackgroundColor },
          paddingX: btnPaddingX,
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
          '& .MuiMenu-list': {
            padding: 0,
          },
          '& .MuiMenu-paper': {
            backgroundColor: 'upperNavbar.background',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            // overflow: 'visible',
          },
        }}
        disablePortal={true}
        anchorOrigin={menuAnchorOrigin}
        transformOrigin={menuTransformOrigin}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
          onMouseEnter: handleMenuEnter,
        }}>
        {menuOffsetBoxHeight ? (
          <Box
            tabIndex={-1}
            sx={{ backgroundColor: menuOffsetBoxBackgroundColor, height: menuOffsetBoxHeight, width: 1 }}
          />
        ) : null}
        <Box
          tabIndex={-1}
          sx={{ padding: 1 }}>
          {children}
        </Box>
      </Menu>
    </>
  );
}
