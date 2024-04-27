import { MenuItem, TextField, TextFieldProps } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SelectField({ options, ...textFieldProps }: SelectFieldProps) {
  return (
    <TextField
      select
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
      {...textFieldProps}>
      {options.map((option) => (
        <MenuItem
          key={option}
          value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
