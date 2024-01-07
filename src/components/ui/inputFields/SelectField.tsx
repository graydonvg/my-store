import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SelectField({ options, ...textFieldProps }: SelectFieldProps) {
  const customColorPalette = useCustomColorPalette();

  return (
    <TextField
      select
      sx={{
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
      }}
      {...textFieldProps}>
      {options.map((option) => (
        <MenuItem
          sx={{
            '&.Mui-selected': {
              color: customColorPalette.typographyVariants.white,
              backgroundColor: customColorPalette.primary.light,
              '&:hover': {
                backgroundColor: customColorPalette.primary.light,
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
