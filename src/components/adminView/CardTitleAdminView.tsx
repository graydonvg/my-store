import Typography from '@mui/material/Typography';
import useColorPalette from '@/hooks/useColorPalette';
import { useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function CardTitleAdminView({ children }: Props) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Typography
      component="h2"
      variant="h6"
      color={mode === 'dark' ? colorPalette.primary.light : colorPalette.primary.dark}
      gutterBottom>
      {children}
    </Typography>
  );
}
