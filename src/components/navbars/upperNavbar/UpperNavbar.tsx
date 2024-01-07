'use client';

import { Box } from '@mui/material';
import UpperNavbarOptions from './UpperNavbarOptions';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function UpperNavbar() {
  const customColorPalette = useCustomColorPalette();

  return (
    <Box sx={{ backgroundColor: customColorPalette.navBar.upper.background }}>
      <CommonNavbarContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '64px', md: '40px' },
          }}>
          <UpperNavbarOptions />
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
