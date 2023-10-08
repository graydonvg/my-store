import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps, useTheme } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
  borderColor?: string;
  styles?: {};
};

export default function CustomTextField({ borderColor, styles, ...props }: CustomTextFieldProps) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const color1 = mode === 'dark' ? color.grey.light : color.grey.dark;

  return (
    <TextField
      sx={{
        ...styles,
        '& label.Mui-focused': {
          color: color1,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: color.blue.light,
          },
        },
      }}
      {...props}
    />
  );
}
