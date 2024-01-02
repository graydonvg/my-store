'use client';

import { Box, useTheme } from '@mui/material';
import LowerNavbarOptions from './LowerNavbarOptions';
import NavbarTitleAndLogo from '../../ui/NavbarTitleAndLogo';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function LowerNavbar() {
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const backgroundColor = mode === 'light' ? customColorPalette.grey.light : customColorPalette.grey.medium;
  const logoColor = mode === 'light' ? customColorPalette.grey.medium : customColorPalette.grey.light;

  return (
    <Box
      id="lower-nav"
      component="div"
      position="sticky"
      sx={{ backgroundColor }}>
      <CommonNavbarContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
          <NavbarTitleAndLogo
            variant="h6"
            display="flex"
            color={logoColor}
          />
          <LowerNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
