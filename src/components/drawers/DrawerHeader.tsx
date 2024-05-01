import { Close } from '@mui/icons-material';
import { IconButton, Toolbar, Typography, useTheme } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
};

export default function DrawerHeader({ label, onClick }: Props) {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        backgroundColor: theme.palette.custom.navbar.upper.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        height: '64px',
      }}>
      <Typography
        color={theme.palette.custom.navbar.upper.text}
        variant="h5"
        component="span">
        {label}
      </Typography>
      <IconButton
        sx={{
          color: theme.palette.custom.navbar.upper.text,
        }}
        aria-label="close drawer"
        onClick={onClick}>
        <Close />
      </IconButton>
    </Toolbar>
  );
}
