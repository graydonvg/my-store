import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SelectField({ options, ...props }: SelectFieldProps) {
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const greyLightOrDark = mode === 'dark' ? color.grey.light : color.grey.dark;

  return (
    <TextField
      select
      defaultValue=""
      sx={{
        '& label.Mui-focused': {
          color: greyLightOrDark,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: color.blue.light,
          },
        },
      }}
      {...props}>
      {options.map((option) => (
        <MenuItem
          sx={{
            '&.Mui-selected': {
              color: color.grey.light,
              backgroundColor: color.blue.light,
              '&:hover': {
                backgroundColor: color.blue.light,
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
