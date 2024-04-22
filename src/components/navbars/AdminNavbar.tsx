import { Menu } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { ThemeToggleIcon } from '../theme/ThemeToggleIcon';
import { useAppDispatch } from '@/lib/redux/hooks';
import { toggleTheme } from '@/lib/redux/slices/themeSlice';
import { ElevationScroll } from '../ui/ElevationScroll';
import { useSelectedLayoutSegments } from 'next/navigation';
import { ReactNode, useState } from 'react';
import AdminNavDrawer from '../drawers/adminNavDrawer/AdminNavDrawer';

const drawerWidth: number = 240;

type Props = {
  children: ReactNode;
};

export default function AdminNavbar({ children }: Props) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';
  const [open, setOpen] = useState(true);

  function toggleDrawer() {
    setOpen(!open);
  }

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
          <Box sx={{ backgroundColor: theme.palette.custom.navBar.upper.background }}>
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
              <IconButton
                aria-label={`Toggle theme. Current mode is ${mode}.`}
                onClick={changeTheme}
                size="small">
                <ThemeToggleIcon
                  size="small"
                  color={theme.palette.custom.navBar.upper.text}
                />
              </IconButton>
            </Toolbar>
          </Box>
        </AppBar>
      </ElevationScroll>
      <AdminNavDrawer
        open={open}
        drawerWidth={drawerWidth}
        toggleDrawer={toggleDrawer}
      />
      <Container
        component="main"
        maxWidth="lg"
        disableGutters
        sx={{
          paddingY: 3,
          paddingX: 3,
          marginRight: 0,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(!open && {
            marginLeft: { xs: theme.spacing(7), sm: theme.spacing(9) },
            transition: theme.transitions.create('margin-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }),
        }}>
        <Toolbar />
        {children}
      </Container>
    </>
  );
}
