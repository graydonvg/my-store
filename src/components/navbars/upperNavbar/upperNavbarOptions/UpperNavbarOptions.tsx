import { useAppSelector } from '@/lib/redux/hooks';
import { Box, useTheme } from '@mui/material';
import NavbarTitle from '../../../ui/NavbarTitle';
import NavDrawer from '../../../drawers/navDrawer/NavDrawer';
import UserSignedOutUpperNavbarOptions from './UserSignedOutUpperNavbarOptions';
import UserSignedInUpperNavbarOptions from './UserSignedInUpperNavbarOptions';

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.userData);
  const theme = useTheme();

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

      <NavbarTitle
        variant="h5"
        display={{ xs: 'flex', md: 'none' }}
        color={theme.palette.custom.navBar.upper.text}
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
