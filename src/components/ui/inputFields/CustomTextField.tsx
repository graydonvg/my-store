import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps, useTheme } from '@mui/material';

export default function CustomTextField({ ...props }: TextFieldProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const greyLightOrDark = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <TextField
      sx={{
        '& label.Mui-focused': {
          color: greyLightOrDark,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: customColorPalette.blue.light,
          },
        },
      }}
      {...props}
    />
  );
}
