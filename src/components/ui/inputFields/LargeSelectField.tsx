import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function LargeSelectField({ options, ...textFieldProps }: SelectFieldProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const focusedLabelColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <TextField
      select
      sx={{
        '& label.Mui-focused': {
          color: focusedLabelColor,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: customColorPalette.blue.light,
          },
        },
      }}
      {...textFieldProps}>
      {options.map((option) => (
        <MenuItem
          sx={{
            '&.Mui-selected': {
              color: customColorPalette.grey.light,
              backgroundColor: customColorPalette.blue.light,
              '&:hover': {
                backgroundColor: customColorPalette.blue.light,
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
