import { BORDER_RADIUS } from '@/config';
import { InputAdornment, MenuItem, TextField, TextFieldProps, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

type SelectFieldProps = TextFieldProps & {
  options: string[];
  icon?: ReactNode;
  hasValue: boolean;
  backgroundColor?: string;
};

export default function SelectField({ options, icon, hasValue, backgroundColor, ...textFieldProps }: SelectFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextField
      select
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={(theme) => ({
        borderRadius: BORDER_RADIUS,
        boxShadow: focused ? theme.palette.custom.textField.boxShadow : 0,
        backgroundColor,

        '& label': {
          color: theme.palette.custom.textField.label,
        },

        '& label.Mui-focused': {
          color: theme.palette.custom.textField.labelFocused,
        },

        '& fieldset': {
          border: `1px solid ${theme.palette.custom.textField.border}`,
        },

        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            border: `1px solid ${theme.palette.custom.textField.hover}`,
          },

          '&.Mui-focused fieldset': {
            border: `1px solid ${theme.palette.custom.textField.focused}`,

            '&:hover': {
              border: `1px solid ${theme.palette.custom.textField.hover}`,
            },
          },
        },
      })}
      InputLabelProps={{
        shrink: hasValue,
        sx: {
          marginLeft: 0,
          ...(icon &&
            !hasValue && {
              marginLeft: 4,
            }),
        },
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment
            position="start"
            sx={{
              color: theme.palette.custom.textField.label,
              ...(focused && { color: theme.palette.custom.textField.labelFocused }),
            }}>
            {icon}
          </InputAdornment>
        ) : null,
      }}
      {...textFieldProps}>
      {options.map((option) => (
        <MenuItem
          key={option}
          value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
