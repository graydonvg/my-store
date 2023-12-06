import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps, useTheme } from '@mui/material';

export default function NumberField({ ...props }: TextFieldProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const focusedColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <TextField
      type="number"
      sx={{
        '& label.Mui-focused': {
          color: focusedColor,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            border: `1px solid ${focusedColor}`,
          },
        },
      }}
      InputProps={{
        inputProps: {
          min: 0,
          max: 4,
        },
      }}
      {...props}
    />
  );
}
