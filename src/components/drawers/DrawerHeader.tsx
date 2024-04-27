import { Close } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
  height?: number;
};

export default function DrawerHeader({ label, onClick, height }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.custom.navBar.upper.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        padding: 2,
        height,
      }}>
      <Typography
        color={theme.palette.custom.navBar.upper.text}
        variant="h5"
        component="span">
        {label}
      </Typography>
      <IconButton
        sx={{
          color: theme.palette.custom.navBar.upper.text,
        }}
        aria-label="close drawer"
        onClick={onClick}>
        <Close />
      </IconButton>
    </Box>
  );
}
