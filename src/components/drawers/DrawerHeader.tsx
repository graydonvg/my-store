import useColorPalette from '@/hooks/useColorPalette';
import { Close } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

type Props = {
  label: string;
  onClick: () => void;
  height?: number;
};

export default function DrawerHeader({ label, onClick, height }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        backgroundColor: colorPalette.navBar.upper.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        padding: 2,
        height,
      }}>
      <Typography
        color={colorPalette.navBar.upper.text}
        variant="h5"
        component="span">
        {label}
      </Typography>
      <IconButton
        size="small"
        sx={{
          cursor: 'pointer',
          padding: 0,
          color: colorPalette.navBar.upper.text,
          '&:hover': { backgroundColor: colorPalette.navBar.upper.background },
        }}
        aria-label="close navigation drawer"
        onClick={onClick}>
        <Close />
      </IconButton>
    </Box>
  );
}
