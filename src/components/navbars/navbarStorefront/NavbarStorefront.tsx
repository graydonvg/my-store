import { AppBar } from '@mui/material';
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
          <LowerNavbar />
        </AppBar>
      </ElevationScroll>
    </>
  );
}
