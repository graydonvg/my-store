import { useAppSelector } from '@/lib/redux/hooks';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import NavbarTitle from '../../../ui/NavbarTitle';
import NavDrawer from '../../../drawers/navDrawer/NavDrawer';
import UserSignedOutUpperNavbarOptions from './UserSignedOutUpperNavbarOptions';
import UserSignedInUpperNavbarOptions from './UserSignedInUpperNavbarOptions';

export default function UpperNavbarOptions() {
  const userData = useAppSelector((state) => state.user.data);
  const theme = useTheme();
  const isBelowMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'space-between', md: 'flex-end' },
        height: { xs: '64px', md: '40px' },
      }}>
      {isBelowMedium ? <NavDrawer /> : null}

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
