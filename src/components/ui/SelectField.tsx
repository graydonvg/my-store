import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
  labelAndBorderColor?: string;
  labelColor?: string;
  focusedLabelColor?: string;
  borderColor?: string;
};

export default function SelectField({
  options,
  labelColor,
  borderColor,
  focusedLabelColor,
  ...props
}: SelectFieldProps) {
  const color = useCustomColorPalette();
  return (
    <TextField
      select
      sx={{
        '& .mui-kc02vp-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
          backgroundColor: 'red',
        },
        '& .MuiInputLabel-root': {
          color: labelColor,
        },
        '& label.Mui-focused': {
          color: focusedLabelColor,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: borderColor,
          },
          '&:hover fieldset': {
            borderColor: color.blue.dark,
          },
          '&.Mui-focused fieldset': {
            borderColor: color.blue.dark,
          },
        },
      }}
      {...props}>
      {options.map((option) => (
        <MenuItem
          sx={{
            '&.Mui-selected': {
              backgroundColor: color.blue.dark,
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
