'use client';

import { Box, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../../ui/NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function LowerNavbar() {
  const customColorPalette = useCustomColorPalette();

  return (
    <Box
      id="lower-nav"
      component="div"
      position="sticky"
      sx={{ backgroundColor: customColorPalette.navBar.lower.background }}>
      <CommonNavbarContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color={customColorPalette.navBar.lower.text}
          />
          <LowerNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
