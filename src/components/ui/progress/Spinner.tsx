import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type SpinnerProps = CircularProgressProps & {
  providedColor?: string;
};

export function Spinner({ providedColor, ...props }: SpinnerProps) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const spinnerColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.lighter;

  return (
    <CircularProgress
      variant="indeterminate"
      sx={{
        '&.MuiCircularProgress-root': {
          color: providedColor ?? spinnerColor,
        },
      }}
      {...props}
    />
  );
}