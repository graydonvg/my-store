import { Box } from '@mui/material';
import CommonNavbarContainer from '../../ui/containers/CommonNavbarContainer';
import NavbarTitle from '../NavbarTitle';
import ThemeToggleButton from '../../theme/ThemeToggleButton';

export default function UpperCheckoutNavbar() {
  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.custom.navbar.upper.background }}>
      <CommonNavbarContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '50px',
          }}>
          <NavbarTitle
            component="h3"
            variant="h5"
            color={(theme) => theme.palette.custom.navbar.upper.text}
            showOnSmallScreen={true}
          />
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'end', alignItems: 'center', paddingRight: '4px' }}>
            <ThemeToggleButton
              edge="end"
              size="medium"
            />
          </Box>
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
