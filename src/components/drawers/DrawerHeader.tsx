import { Close } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
  height?: number;
};

export default function DrawerHeader({ label, onClick, height }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.custom.navBar.upper.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        padding: 2,
        height,
      }}>
      <Typography
        color={(theme) => theme.palette.custom.navBar.upper.text}
        variant="h5"
        component="span">
        {label}
      </Typography>
      <IconButton
        size="small"
        sx={(theme) => ({
          cursor: 'pointer',
          padding: 0,
          color: theme.palette.custom.navBar.upper.text,
          '&:hover': { backgroundColor: theme.palette.custom.navBar.upper.background },
        })}
        aria-label="close navigation drawer"
        onClick={onClick}>
        <Close />
      </IconButton>
    </Box>
  );
}
