import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type Props = {
  label: string;
};

export default function NavDrawerOptionIcon({ label }: Props) {
  if (label === 'Sign Out') {
    return (
      <IconButton
        sx={(theme) => ({
          color: theme.palette.custom.navbar.upper.text,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        })}>
        <Logout sx={{ color: (theme) => theme.palette.custom.navbar.lower.text }} />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        sx={(theme) => ({
          color: theme.palette.custom.navbar.upper.text,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        })}>
        <ArrowForwardIos sx={{ color: (theme) => theme.palette.custom.navbar.lower.text }} />
      </IconButton>
    );
  }
}
