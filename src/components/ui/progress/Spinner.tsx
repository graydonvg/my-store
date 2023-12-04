import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

type SpinnerProps = CircularProgressProps & {
  spinnerColor?: string;
};

export function Spinner({ spinnerColor, ...props }: SpinnerProps) {
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
