import { TextField, TextFieldProps } from '@mui/material';

export default function CustomTextField({ ...props }: TextFieldProps) {
  return (
    <TextField
      sx={(theme) => ({
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
      })}
      {...props}
    />
  );
}
