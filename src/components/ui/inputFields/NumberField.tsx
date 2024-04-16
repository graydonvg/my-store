import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  styles?: {};
};

export default function NumberField({ styles, ...props }: Props) {
  return (
    <TextField
      type="number"
      sx={(theme) => ({
        ...styles,
        '& label': {
          color: theme.palette.custom.textField.label,
        },
        '& fieldset': {
          borderColor: theme.palette.custom.textField.border,
        },
        '& label.Mui-focused': {
          color: theme.palette.custom.textField.focused,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            border: `1px solid ${theme.palette.custom.textField.focused}`,
          },
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none',
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      })}
      {...props}
    />
  );
}
