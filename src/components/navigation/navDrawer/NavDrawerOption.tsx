'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { ArrowForwardIos, Logout } from '@mui/icons-material';

type NavDrawerOptionProps = {
  onClick?: () => void;
  path?: string;
  label: string;
  bodyTextColor: string;
  drawerWidth: string;
};

function renderIcon(label: string, bodyTextColor: string) {
  if (label === 'Sign Out') {
    return <Logout sx={{ color: bodyTextColor }} />;
  } else {
    return <ArrowForwardIos sx={{ color: bodyTextColor }} />;
  }
}

export default function NavDrawerOption({ onClick, path, label, bodyTextColor, drawerWidth }: NavDrawerOptionProps) {
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
              {renderIcon(label, bodyTextColor)}
            </ListItemButton>
          </Link>
        ) : (
          <ListItemButton sx={{ width: drawerWidth }}>
            <ListItemText
              primary={label}
              sx={{ color: bodyTextColor }}
            />
            {renderIcon(label, bodyTextColor)}
          </ListItemButton>
        )}
      </ListItem>
      <Divider />
    </>
  );
}
