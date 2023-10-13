import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useTheme } from '@mui/material';

export function Spinner(props: CircularProgressProps) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const spinnerColor = mode === 'dark' ? color.grey.dark : color.grey.light;

  return (
    <CircularProgress
      variant="indeterminate"
      sx={{
        '&.MuiCircularProgress-root': {
          color: spinnerColor,
        },
      }}
      {...props}
    />
  );
}
