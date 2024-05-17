import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { ElevationScroll } from '../../ui/ElevationScroll';
import AdminPanelNavDrawer from '../../drawers/AdminPanelNavDrawer';
import ThemeToggleButton from '../../theme/ThemeToggleButton';
import AdminPanelNavbarTitle from './AdminPanelNavbarTitle';

type Props = {
  drawerWidth: number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
};

export default function LargeAdminPanelNavbar({ drawerWidth, isDrawerOpen, toggleDrawer }: Props) {
  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            // bg color set below to prevent color lightening from elevation scroll
            backgroundColor: 'transparent',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            ...(isDrawerOpen && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
            }),
          }}>
          <Box
            sx={{
              // bg color set here to prevent color lightening from elevation scroll
              backgroundColor: (theme) => theme.palette.custom.navbar.upper.background,
            }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(isDrawerOpen && { display: 'none' }),
                }}>
                <Menu />
              </IconButton>
              <AdminPanelNavbarTitle />
              <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', flex: 1 }}>
                <ThemeToggleButton size="medium" />
              </Box>
            </Toolbar>
          </Box>
        </AppBar>
      </ElevationScroll>
      <AdminPanelNavDrawer
        isDrawerOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}
