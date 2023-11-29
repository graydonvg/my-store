import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { MenuItem, TextField, TextFieldProps, Typography, useTheme } from '@mui/material';

type SelectFieldProps = TextFieldProps & {
  options: string[];
};

export default function SmallSelectField({ options, ...textFieldProps }: SelectFieldProps) {
  const customColorPalette = useCustomColorPalette();

  return (
    <TextField
      select
      sx={{
        '& .MuiOutlinedInput-input': {
          padding: 0,
          paddingLeft: 1,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
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
          <Typography
            lineHeight={1}
            component="span"
            fontSize={16}
            fontWeight={600}>
            {option}
          </Typography>
          {/* {option} */}
        </MenuItem>
      ))}
    </TextField>
  );
}
