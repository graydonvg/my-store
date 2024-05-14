import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { ElevationScroll } from '../../ui/ElevationScroll';
import { useSelectedLayoutSegments } from 'next/navigation';
import NavDrawerAdminPanel from '../../drawers/NavDrawerAdminPanel';
import ThemeToggleButton from '../../theme/ThemeToggleButton';

type Props = {
  drawerWidth: number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
};

export default function LargeNavbarAdminPanel({ drawerWidth, isDrawerOpen, toggleDrawer }: Props) {
  const theme = useTheme();
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';

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
            ...(isDrawerOpen && {
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
                  ...(isDrawerOpen && { display: 'none' }),
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
        isDrawerOpen={isDrawerOpen}
        drawerWidth={drawerWidth}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
}
