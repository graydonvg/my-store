import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

export default function CustomTextField({ ...props }: TextFieldProps) {
  const customColorPalette = useCustomColorPalette();

  return (
    <TextField
      sx={{
        '& label.Mui-focused': {
          color: customColorPalette.textField.focused,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            border: `1px solid ${customColorPalette.textField.focused}`,
          },
        },
      }}
      {...props}
    />
  );
}
