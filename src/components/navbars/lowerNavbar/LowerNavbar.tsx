import { Box } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function LowerNavbar() {
  return (
    <Box
      id="lower-nav"
      component="div"
      position="sticky"
      sx={{ backgroundColor: (theme) => theme.palette.custom.navbar.lower.background }}>
      <CommonNavbarContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <LowerNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
