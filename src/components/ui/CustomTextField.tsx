import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler } from 'react';

type CustomTextFieldProps = {
  key?: string | number;
  margin?: 'dense' | 'normal' | 'none' | undefined;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
  label: string;
  name: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  labelAndBorderColor?: string;
  labelColor?: string;
  focusedLabelColor?: string;
  borderColor?: string;
};

export default function CustomTextField({
  key,
  margin,
  required,
  fullWidth,
  id,
  label,
  name,
  type,
  autoComplete,
  value,
  onChange,
  autoFocus,
  labelColor,
  borderColor,
  focusedLabelColor,
}: CustomTextFieldProps) {
  const color = useCustomColorPalette();
  return (
    <TextField
      key={key}
      sx={{
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
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      id={id}
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
    />
  );
}
