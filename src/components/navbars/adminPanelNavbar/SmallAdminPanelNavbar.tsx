import { Box } from '@mui/material';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import AdminPanelNavbarTitle from './AdminPanelNavbarTitle';
import NavDrawerButton from '@/components/ui/buttons/complex/NavDrawerButton';
import UpperNavbarContainer from '../storefrontNavbar/upperNavbar/UpperNavbarContainer';

export default function SmallAdminPanelNavbar() {
  return (
    <UpperNavbarContainer>
      <NavDrawerButton />
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
