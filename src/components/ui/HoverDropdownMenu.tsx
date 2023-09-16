'use client';

import { Box, Button, Menu, PopoverOrigin, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

type HoverDropdownMenuProps = {
  children: ReactNode;
  labelContent: ReactNode;
  menuAnchorOrigin: PopoverOrigin;
  menuTransformOrigin: PopoverOrigin;
  menuOffsetBoxHeight?: string;
  menuOffsetBoxBackgroundColor?: string;
};

export default function HoverDropdownMenu({
  children,
  labelContent,
  menuAnchorOrigin,
  menuTransformOrigin,
  menuOffsetBoxHeight,
  menuOffsetBoxBackgroundColor,
}: HoverDropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let timeoutId: NodeJS.Timeout | null = null;

  function handleOpen(event: React.MouseEvent<HTMLDivElement>) {
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          paddingX: 2,
          paddingY: 1,
          cursor: 'pointer',
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}>
        {labelContent}
      </Box>
      <Menu
        elevation={0}
        sx={{
          '& .MuiMenu-list': {
            padding: 0,
          },
          '& .MuiMenu-paper': {
            backgroundColor: 'custom.grey.dark',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: 'visible',
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
