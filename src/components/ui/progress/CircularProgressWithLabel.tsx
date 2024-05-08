import CircularProgress, { CircularProgressProps, circularProgressClasses } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

export function CircularProgressWithLabel(props: CircularProgressProps) {
  const theme = useTheme();
  const progress = props.value as number;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          [`&.${circularProgressClasses.root}`]: { color: theme.palette.primary.light },
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ color: theme.palette.text.primary }}>
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
