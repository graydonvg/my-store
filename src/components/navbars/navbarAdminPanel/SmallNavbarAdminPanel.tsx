import { Box } from '@mui/material';
import UpperNavbarContainer from '../navbarStorefront/upperNavbar/UpperNavbarContainer';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import AdminPanelNavbarTitle from './AdminPanelNavbarTitle';

export default function SmallNavbarAdminPanel() {
  return (
    <UpperNavbarContainer>
      <NavDrawer />
      <AdminPanelNavbarTitle />
      <Box>
        <ThemeToggleButton
          edge="end"
          size="medium"
        />
      </Box>
    </UpperNavbarContainer>
  );
}
