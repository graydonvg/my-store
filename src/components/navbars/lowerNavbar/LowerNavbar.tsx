import { Box } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import useColorPalette from '@/hooks/useColorPalette';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function LowerNavbar() {
  const colorPalette = useColorPalette();

  return (
    <Box
      id="lower-nav"
      component="div"
      position="sticky"
      sx={{ backgroundColor: colorPalette.navBar.lower.background }}>
      <CommonNavbarContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <LowerNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
