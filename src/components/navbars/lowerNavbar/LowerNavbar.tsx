import { Box } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../../ui/NavbarTitleAndLogo';
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
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color={colorPalette.navBar.lower.text}
          />
          <LowerNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
