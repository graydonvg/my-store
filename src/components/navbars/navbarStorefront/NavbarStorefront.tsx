import { AppBar, Box } from '@mui/material';
import LowerNavbar from './lowerNavbar/LowerNavbar';
import UpperNavbar from './upperNavbar/UpperNavbar';
import { ElevationScroll } from '@/components/ui/ElevationScroll';

export default function NavbarStorefront() {
  return (
    <>
      <ElevationScroll>
        <AppBar
          color="transparent"
          elevation={0}
          position="sticky">
          <UpperNavbar />
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LowerNavbar />
          </Box>
        </AppBar>
      </ElevationScroll>
    </>
  );
}
