import { AppBar, Box } from '@mui/material';
import ThemeToggleButton from '@/components/theme/ThemeToggleButton';
import NavDrawer from '@/components/drawers/navDrawer/NavDrawer';
import AdminPanelNavbarTitle from './AdminPanelNavbarTitle';
import NavDrawerButton from '@/components/ui/buttons/complex/NavDrawerButton';
import UpperNavbarContainer from '../storefrontNavbar/upperNavbar/UpperNavbarContainer';
import { ElevationScroll } from '@/components/ui/ElevationScroll';

export default function SmallAdminPanelNavbar() {
  return (
    <ElevationScroll>
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky">
        <UpperNavbarContainer>
          <NavDrawerButton />
          <NavDrawer />
          <AdminPanelNavbarTitle />
          <Box sx={{ paddingRight: '4px' }}>
            <ThemeToggleButton
              edge="end"
              size="medium"
            />
          </Box>
        </UpperNavbarContainer>
      </AppBar>
    </ElevationScroll>
  );
}
