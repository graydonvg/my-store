import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
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
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: 'navDrawer.contentBackground',
              },
            }}
            hideBackdrop={true}
            anchor={anchor}
            open={isDrawerOpen[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{ display: { md: 'none' } }}>
            <Box
              sx={{
                backgroundColor: 'navDrawer.headerBackground',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
              }}>
              <Typography
                color="navDrawer.headerText"
                variant="h5"
                component={'h2'}>
                Menu
              </Typography>
              <IconButton
                sx={{ color: 'navDrawer.headerText' }}
                onClick={toggleDrawer(anchor, false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {content}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
