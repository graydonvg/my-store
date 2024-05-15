'use client';

import { Container, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import SmallNavbarAdminPanel from '@/components/navbars/navbarAdminPanel/SmallNavbarAdminPanel';
import LargeNavbarAdminPanel from '@/components/navbars/navbarAdminPanel/LargeNavbarAdminPanel';

type Props = {
  children: ReactNode;
};

export default function LayoutAdminPanel({ children }: Props) {
  const drawerWidth: number = 240;
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  function toggleLargeNavbarDrawer() {
    setIsDrawerOpen((prev) => !prev);
  }

  return (
    <>
      {!isBelowMedium ? (
        <>
          <LargeNavbarAdminPanel
            drawerWidth={drawerWidth}
            isDrawerOpen={isDrawerOpen}
            toggleDrawer={toggleLargeNavbarDrawer}
          />
          <Container
            component="main"
            disableGutters
            sx={{
              maxWidth: `calc(100% - ${drawerWidth}px) !important`,
              marginRight: 0,
              marginLeft: `${drawerWidth}px`,
              ...(!isDrawerOpen && {
                maxWidth: { xs: `calc(100% - ${theme.spacing(7)})`, sm: `calc(100% - ${theme.spacing(9)})` },
                marginLeft: { xs: theme.spacing(7), sm: theme.spacing(9) },
              }),
            }}>
            <Toolbar />
            {children}
          </Container>
        </>
      ) : (
        <>
          <SmallNavbarAdminPanel />
          <Container
            component="main"
            disableGutters>
            {children}
          </Container>
        </>
      )}
    </>
  );
}
