'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { ArrowForwardIos, Logout } from '@mui/icons-material';

type NavDrawerNavOptionProps = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
  drawerWidth: string;
};

export default function NavDrawerNavOption({
  onClick,
  path,
  label,
  bodyTextColor,
  drawerWidth,
}: NavDrawerNavOptionProps) {
  function renderIcon() {
    if (label === 'Sign Out') {
      return <Logout sx={{ color: bodyTextColor }} />;
    } else {
      return <ArrowForwardIos sx={{ color: bodyTextColor }} />;
    }
  }

  return (
    <>
      <ListItem
        disablePadding
        onClick={onClick}>
        {path ? (
          <Link
            tabIndex={-1}
            href={path}>
            <ListItemButton sx={{ width: drawerWidth }}>
              <ListItemText
                primary={label}
                sx={{ color: bodyTextColor }}
              />
              {renderIcon()}
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ width: drawerWidth }}>
            <ListItemText
              primary={label}
              sx={{ color: bodyTextColor }}
            />
            {renderIcon()}
          </ListItemButton>
        )}
      </ListItem>
      <Divider />
    </>
  );
}
