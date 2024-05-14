import { Box, Typography, useTheme } from '@mui/material';
import UpperNavbarContainer from '../navbarStorefront/upperNavbar/UpperNavbarContainer';
import { useSelectedLayoutSegments } from 'next/navigation';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';

export default function SmallNavbarAdminPanel() {
  const theme = useTheme();
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';

  return (
    <UpperNavbarContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          height: { xs: '64px', md: '40px' },
        }}>
        <NavDrawer />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ textTransform: 'capitalize', color: theme.palette.custom.navbar.upper.text }}>
          {currentPath}
        </Typography>
        <Box>
          <ThemeToggleButton
            edge="end"
            size="medium"
          />
        </Box>
      </Box>
    </UpperNavbarContainer>
  );
}
