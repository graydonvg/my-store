import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material';

export function Spinner(props: CircularProgressProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const spinnerColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)';

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
