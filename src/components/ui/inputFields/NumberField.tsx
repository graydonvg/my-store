import useColorPalette from '@/hooks/useColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  styles?: {};
};

export default function NumberField({ styles, ...props }: Props) {
  const colorPalette = useColorPalette();

  return (
    <TextField
      type="number"
      sx={{
        ...styles,
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
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none',
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      }}
      {...props}
    />
  );
}
