import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField, TextFieldProps, useTheme } from '@mui/material';

type PercentageFieldProps = TextFieldProps & {
  borderColor?: string;
  styles?: {};
};

export default function PercentageField({ borderColor, styles, ...props }: PercentageFieldProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const greyLightOrDark = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  return (
    <TextField
      type="number"
      sx={{
        ...styles,
        '& label.Mui-focused': {
          color: greyLightOrDark,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: customColorPalette.blue.light,
          },
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none',
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      }}
      InputProps={{
        inputProps: {
          pattern: '^d+(.d{1,2})?%',
          placeholder: '0.00%',
        },
      }}
      {...props}
    />
  );
}
