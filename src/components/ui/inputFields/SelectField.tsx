import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SelectField({ options, ...props }: SelectFieldProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const greyLightOrDark = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <TextField
      select
      sx={{
        '& label.Mui-focused': {
          color: greyLightOrDark,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: customColorPalette.blue.light,
          },
        },
      }}
      {...props}>
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
