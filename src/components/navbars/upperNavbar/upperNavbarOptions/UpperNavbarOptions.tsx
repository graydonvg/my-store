import { useAppSelector } from '@/lib/redux/hooks';
import { Box } from '@mui/material';
import NavbarTitleAndLogo from '../../../ui/NavbarTitleAndLogo';
import useColorPalette from '@/hooks/useColorPalette';
import NavDrawer from '../../../drawers/navDrawer/NavDrawer';
import UserSignedOutUpperNavbarOptions from './UserSignedOutUpperNavbarOptions';
import UserSignedInUpperNavbarOptions from './UserSignedInUpperNavbarOptions';

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.userData);
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'space-between', md: 'flex-end' },
        height: { xs: '64px', md: '40px' },
      }}>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}>
        <NavDrawer />
      </Box>
      <NavbarTitleAndLogo
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={colorPalette.navBar.upper.text}
      />
      <Box
        component="nav"
        sx={{ height: 1 }}>
        {!userData ? <UserSignedOutUpperNavbarOptions /> : null}
        {userData ? <UserSignedInUpperNavbarOptions /> : null}
      </Box>
    </Box>
  );
}
