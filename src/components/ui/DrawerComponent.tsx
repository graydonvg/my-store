'use client';

import { Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import Drawer from '@mui/material/Drawer';
import { DrawerAnchor } from '@/types';
import NavDrawerContent from '@/components/navigation/navDrawer/NavDrawerContent';

function renderDrawerContent(drawerContent: 'nav' | 'cart' | null) {
  return drawerContent === 'nav' ? <NavDrawerContent /> : null;
}

export default function DrawerComponent() {
  const isDrawerOpen = useAppSelector((state) => state.drawer.isDrawerOpen);
  const drawerContent = useAppSelector((state) => state.drawer.drawerContent);
  const dispatch = useAppDispatch();

  const handleToggleDrawer =
    (anchor: DrawerAnchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
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
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: 'background.default',
              },
            }}
            hideBackdrop={true}
            anchor={anchor}
            open={isDrawerOpen[anchor]}
            onClose={handleToggleDrawer(anchor, false)}>
            {renderDrawerContent(drawerContent)}
          </Drawer>
        </Fragment>
      ))}
    </>
  );
}
