import { Box } from '@mui/material';
import UpperNavbarOptions from './upperNavbarOptions/UpperNavbarOptions';
import useColorPalette from '@/hooks/useColorPalette';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function UpperNavbar() {
  const colorPalette = useColorPalette();

  return (
    <Box sx={{ backgroundColor: colorPalette.navBar.upper.background }}>
      <CommonNavbarContainer>
        <UpperNavbarOptions />
      </CommonNavbarContainer>
    </Box>
  );
}
