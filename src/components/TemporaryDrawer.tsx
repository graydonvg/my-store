import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { DrawerAnchor } from '@/types';

type TemporaryDrawerProps = {
  content: JSX.Element;
};

export default function TemporaryDrawer({ content }: TemporaryDrawerProps) {
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
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            className="md:hidden"
            hideBackdrop={true}
            anchor={anchor}
            open={isDrawerOpen[anchor]}
            onClose={toggleDrawer(anchor, false)}>
            <Box className="flex justify-between items-center">
              <Typography
                className="pl-4 my-4"
                variant="h5"
                component={'h2'}>
                Menu
              </Typography>
              <CloseIcon
                className="pr-4 cursor-pointer"
                onClick={toggleDrawer(anchor, false)}
              />
            </Box>
            {content}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
