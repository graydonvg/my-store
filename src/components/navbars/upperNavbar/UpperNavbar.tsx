import { Box } from '@mui/material';
import UpperNavbarOptions from './upperNavbarOptions/UpperNavbarOptions';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';

export default function UpperNavbar() {
  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.custom.navBar.upper.background }}>
      <CommonNavbarContainer>
        <UpperNavbarOptions />
      </CommonNavbarContainer>
    </Box>
  );
}
