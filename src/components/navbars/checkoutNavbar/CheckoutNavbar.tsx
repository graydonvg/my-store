import { AppBar } from '@mui/material';
import { ElevationScroll } from '../../ui/ElevationScroll';
import UpperCheckoutNavbar from './UpperCheckoutNavbar';
import LowerCheckoutNavbar from './LowerCheckoutNavbar';

export default function CheckoutNavbar() {
  return (
    <ElevationScroll>
      <AppBar
        color="transparent"
        elevation={0}
        position="sticky">
        <UpperCheckoutNavbar />
        <LowerCheckoutNavbar />
      </AppBar>
    </ElevationScroll>
  );
}
