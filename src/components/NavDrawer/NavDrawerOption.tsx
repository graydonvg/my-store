'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';

type NavDrawerNavOptionProps = {
  path: string;
  label: string;
  bodyTextColor: string;
  drawerWidth: string;
};

export default function NavDrawerNavOption({ path, label, bodyTextColor, drawerWidth }: NavDrawerNavOptionProps) {
  const dispatch = useAppDispatch();

  function closeDrawer() {
    dispatch(setIsDrawerOpen({ left: false }));
  }

  return (
    <>
      <ListItem
        disablePadding
        onClick={closeDrawer}>
        <Link
          tabIndex={-1}
          href={path}>
          <ListItemButton sx={{ width: drawerWidth }}>
            <ListItemText
              primary={label}
              sx={{ color: bodyTextColor }}
            />
            <ArrowForwardIosIcon sx={{ color: bodyTextColor }} />
          </ListItemButton>
        </Link>
      </ListItem>
      <Divider />
    </>
  );
}
