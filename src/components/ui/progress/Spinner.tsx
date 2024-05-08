import CircularProgress, { CircularProgressProps, circularProgressClasses } from '@mui/material/CircularProgress';

type SpinnerProps = CircularProgressProps & {
  spinnerColor?: string;
};

export function Spinner({ spinnerColor, ...props }: SpinnerProps) {
  return (
    <CircularProgress
      variant="indeterminate"
      sx={{
        [`&.${circularProgressClasses.root}`]: { color: spinnerColor },
      }}
      {...props}
    />
  );
}
