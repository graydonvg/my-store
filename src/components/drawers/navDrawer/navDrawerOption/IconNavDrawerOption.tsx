import { ArrowForwardIos, Logout } from '@mui/icons-material';

type Props = {
  label: string;
};

export default function IconNavDrawerOption({ label }: Props) {
  if (label === 'Sign Out') {
    return <Logout sx={{ color: (theme) => theme.palette.custom.navBar.lower.text }} />;
  } else {
    return <ArrowForwardIos sx={{ color: (theme) => theme.palette.custom.navBar.lower.text }} />;
  }
}
