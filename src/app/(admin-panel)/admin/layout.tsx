'use client';

import LargeAdminPanelNavbar from '@/components/navbars/adminPanelNavbar/LargeAdminPanelNavbar';
import SmallAdminPanelNavbar from '@/components/navbars/adminPanelNavbar/SmallAdminPanelNavbar';
import { Container, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

export default function AdminPanelLayout({ children }: Props) {
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
          <LargeAdminPanelNavbar
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
          <SmallAdminPanelNavbar />
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
