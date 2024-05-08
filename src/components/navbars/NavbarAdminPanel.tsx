import { Menu } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { ElevationScroll } from '../ui/ElevationScroll';
import { useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode, useState } from 'react';
import NavDrawerAdminPanel from '../drawers/NavDrawerAdminPanel';
import ThemeToggleButton from '../theme/ThemeToggleButton';

const drawerWidth: number = 240;

type Props = {
  children: ReactNode;
};

export default function NavbarAdminPanel({ children }: Props) {
  const theme = useTheme();
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';
  const [open, setOpen] = useState(true);

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            // bg color set below to prevent color lightening from elevation scroll
            backgroundColor: 'transparent',
            zIndex: theme.zIndex.drawer + 1,
            ...(open && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
            }),
          }}>
          <Box
            sx={{
              // bg color set here to prevent color lightening from elevation scroll
              backgroundColor: theme.palette.custom.navbar.upper.background,
            }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}>
                <Menu />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
                {currentPath}
              </Typography>
              <ThemeToggleButton size="medium" />
            </Toolbar>
          </Box>
        </AppBar>
      </ElevationScroll>
      <NavDrawerAdminPanel
        open={open}
        drawerWidth={drawerWidth}
        toggleDrawer={toggleDrawer}
      />
      <Container
        component="main"
        disableGutters
        sx={{
          maxWidth: `calc(100vw - ${drawerWidth}px) !important`,
          marginRight: 0,
          marginLeft: `${drawerWidth}px`,
          ...(!open && {
            maxWidth: { xs: `calc(100vw - ${theme.spacing(7)})`, sm: `calc(100vw - ${theme.spacing(9)})` },
            marginLeft: { xs: theme.spacing(7), sm: theme.spacing(9) },
          }),
        }}>
        <Toolbar />
        {children}
      </Container>
    </>
  );
}
