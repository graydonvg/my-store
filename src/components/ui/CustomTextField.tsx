import { TextField } from '@mui/material';
import { ChangeEvent, ChangeEventHandler } from 'react';

type CustomTextFieldProps = {
  key?: string | number;
  sx?: Record<string, string | number>;
  margin?: 'dense' | 'normal' | 'none' | undefined;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
  label: string;
  name: string;
  type: string;
  autoFocus?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function CustomTextField({
  key,
  sx,
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
}: CustomTextFieldProps) {
  return (
    <TextField
      key={key}
      sx={{
        ...sx,
        '& label.Mui-focused': {
          color: 'custom.blue.light',
        },
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'custom.blue.dark',
            color: 'custom.blue.dark',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'custom.blue.light',
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
