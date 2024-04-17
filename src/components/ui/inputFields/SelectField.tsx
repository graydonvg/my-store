import { MenuItem, TextField, TextFieldProps, lighten } from '@mui/material';

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
          sx={(theme) => ({
            '&.Mui-selected': {
              color: theme.palette.custom.typographyVariants.white,
              backgroundColor: theme.palette.custom.primary.light,
              '&:hover': {
                backgroundColor: lighten(theme.palette.custom.primary.light, 0.1),
              },
            },
          })}
          key={option}
          value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
