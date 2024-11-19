import { Box, useTheme } from '@mui/material';
import CommonNavbarContainer from '../CommonNavbarContainer';
import NavbarTitle from '../NavbarTitle';
import ThemeToggleButton from '../../theme/ThemeToggleButton';

export default function UpperCheckoutNavbar() {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.custom.navbar.upper.background }}>
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
            color={theme.palette.custom.navbar.upper.text}
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
