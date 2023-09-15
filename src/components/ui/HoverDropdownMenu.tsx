'use client';

import { Box, Button, Menu, PopoverOrigin, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';

type HoverDropdownMenuProps = {
  children: ReactNode;
  menuOffsetBoxHeight?: string;
  menuOffsetBoxBackgroundColor?: string;
  menuAnchorOrigin: PopoverOrigin;
  menuTransformOrigin: PopoverOrigin;
  labelContent: ReactNode;
  labelTextColor?: string;
  labelTextColorOnHover?: string;
  labelTextUnderlineColorOnHover?: string;
  labelPaddingX?: number;
};

export default function HoverDropdownMenu({
  children,
  menuOffsetBoxHeight,
  menuOffsetBoxBackgroundColor,
  menuAnchorOrigin,
  menuTransformOrigin,
  labelContent,
  labelTextColor,
  labelTextColorOnHover,
  labelTextUnderlineColorOnHover,
  labelPaddingX,
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
      <Typography
        sx={{
          cursor: 'pointer',
          height: 1,
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          color: labelTextColor,
          margin: 0,
          paddingX: labelPaddingX,
          paddingY: '6px',
          zIndex: (theme) => theme.zIndex.modal + 1,
          '&:hover': {
            color: labelTextColorOnHover,
            textDecoration: 'underline',
            textDecorationColor: labelTextUnderlineColorOnHover,
            textDecorationThickness: 1,
            textUnderlineOffset: 6,
          },
        }}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}>
        {labelContent}
      </Typography>
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
