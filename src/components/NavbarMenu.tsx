import { navbarButtonStyles } from '@/lib/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';

type NavbarMenuProps = {
  path: string;
  label: string;
};

export default function NavbarMenu({ path, label }: NavbarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleOpen(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

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
      <Link
        tabIndex={-1}
        href={path}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ ...navbarButtonStyles, zIndex: (theme) => theme.zIndex.modal + 1 }}
          // onClick={handleOpen}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}>
          {label}
        </Button>
      </Link>
      <Menu
        elevation={0}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
          onMouseEnter: handleMenuEnter,
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
}
