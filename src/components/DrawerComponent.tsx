'use client';

import { ReactNode, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import Drawer from '@mui/material/Drawer';
import { DrawerAnchor } from '@/types';

type DrawerComponentProps = {
  children: ReactNode;
};

export default function DrawerComponent({ children }: DrawerComponentProps) {
  const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);
  const dispatch = useAppDispatch();

  const toggleDrawer = (anchor: DrawerAnchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    dispatch(setIsDrawerOpen({ [anchor]: open }));
  };

  return (
    <>
      {(['left', 'right'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: 'navDrawer.bodyBackground',
              },
            }}
            hideBackdrop={true}
            anchor={anchor}
            open={isDrawerOpen[anchor]}
            onClose={toggleDrawer(anchor, false)}>
            {children}
          </Drawer>
        </Fragment>
      ))}
    </>
  );
}
