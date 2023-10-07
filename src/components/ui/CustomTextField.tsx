import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
  labelAndBorderColor?: string;
  labelColor?: string;
  focusedLabelColor?: string;
  borderColor?: string;
};

export default function CustomTextField({
  labelColor,
  borderColor,
  focusedLabelColor,
  ...props
}: CustomTextFieldProps) {
  const color = useCustomColorPalette();
  return (
    <TextField
      sx={{
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
            borderColor: color.blue.dark,
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
