import useColorPalette from '@/hooks/useColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

export default function CustomTextField({ ...props }: TextFieldProps) {
  const colorPalette = useColorPalette();

  return (
    <TextField
      sx={{
        '& label': {
          color: colorPalette.textField.label,
        },
        '& fieldset': {
          borderColor: colorPalette.textField.border,
        },
        '& label.Mui-focused': {
          color: colorPalette.textField.focused,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            border: `1px solid ${colorPalette.textField.focused}`,
          },
        },
      }}
      {...props}
    />
  );
}
