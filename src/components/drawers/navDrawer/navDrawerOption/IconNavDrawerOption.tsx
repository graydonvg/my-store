import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type Props = {
  label: string;
};

export default function IconNavDrawerOption({ label }: Props) {
  if (label === 'Sign Out') {
    return (
      <IconButton
        sx={(theme) => ({
          color: theme.palette.custom.navBar.upper.text,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        })}>
        <Logout sx={{ color: (theme) => theme.palette.custom.navBar.lower.text }} />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        sx={(theme) => ({
          color: theme.palette.custom.navBar.upper.text,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        })}>
        <ArrowForwardIos sx={{ color: (theme) => theme.palette.custom.navBar.lower.text }} />
      </IconButton>
    );
  }
}
