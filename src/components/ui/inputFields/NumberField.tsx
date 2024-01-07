import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  styles?: {};
};

export default function NumberField({ styles, ...props }: Props) {
  const customColorPalette = useCustomColorPalette();

  return (
    <TextField
      type="number"
      sx={{
        ...styles,
        '& label': {
          color: customColorPalette.textField.label,
        },
        '& fieldset': {
          borderColor: customColorPalette.textField.border,
        },
        '& label.Mui-focused': {
          color: customColorPalette.textField.focused,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            border: `1px solid ${customColorPalette.textField.focused}`,
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
