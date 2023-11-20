import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useTheme } from '@mui/material';

export function CircularProgressWithLabel(props: CircularProgressProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;
  const progress = props.value as number;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          '&.MuiCircularProgress-root': {
            color: customColorPalette.blue.light,
          },
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
          sx={{ color: textColor }}>
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
