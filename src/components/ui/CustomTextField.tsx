import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
  labelAndBorderColor?: string;
  labelColor?: string;
  focusedLabelColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  styles?: {};
};

export default function CustomTextField({
  labelColor,
  borderColor,
  hoverBorderColor,
  focusedLabelColor,
  styles,
  ...props
}: CustomTextFieldProps) {
  const color = useCustomColorPalette();
  return (
    <TextField
      sx={{
        ...styles,
        '& .MuiInputLabel-root': {
          color: labelColor,
        },
        '& label.Mui-focused': {
          color: focusedLabelColor,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: borderColor,
          },
          '&:hover fieldset': {
            borderColor: hoverBorderColor,
          },
          '&.Mui-focused fieldset': {
            borderColor: color.blue.dark,
          },
        },
      }}
      {...props}
    />
  );
}
