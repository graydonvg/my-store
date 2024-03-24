import { Menu } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch } from '@/lib/redux/hooks';
import useColorPalette from '@/hooks/useColorPalette';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { ElevationScroll } from '../ui/ElevationScroll';

const drawerWidth: number = 240;

type Props = {
  open: boolean;
  toggleDrawer: () => void;
};

export default function AdminNavbar({ open, toggleDrawer }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colorPalette = useColorPalette();

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(open && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}>
          <Box sx={{ backgroundColor: colorPalette.navBar.upper.background }}>
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
                sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <IconButton
                aria-label={`Toggle theme. Current mode is ${mode}.`}
                onClick={changeTheme}
                size="small">
                <ThemeToggleIcon
                  size="small"
                  color={colorPalette.navBar.upper.text}
                />
              </IconButton>
            </Toolbar>
          </Box>
        </AppBar>
      </ElevationScroll>
    </>
  );
}
