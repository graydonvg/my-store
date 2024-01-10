import useColorPalette from '@/hooks/useColorPalette';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SelectField({ options, ...textFieldProps }: SelectFieldProps) {
  const colorPalette = useColorPalette();

  return (
    <TextField
      select
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
      {...textFieldProps}>
      {options.map((option) => (
        <MenuItem
          sx={{
            '&.Mui-selected': {
              color: colorPalette.typographyVariants.white,
              backgroundColor: colorPalette.primary.light,
              '&:hover': {
                backgroundColor: colorPalette.primary.light,
              },
            },
          }}
          key={option}
          value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
