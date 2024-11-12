import { CONSTANTS } from '@/constants';
import { InputAdornment, TextField, TextFieldProps, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

type Props = TextFieldProps & {
  styles?: {};
  icon?: ReactNode;
  hasValue: boolean;
  backgroundColor?: string;
};

export default function NumberField({ styles, icon, hasValue, backgroundColor, ...props }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextField
      type="number"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={(theme) => ({
        ...styles,
        borderRadius: CONSTANTS.BORDER_RADIUS,
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

        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          display: 'none',
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      })}
      slotProps={{
        inputLabel: {
          shrink: focused || hasValue,
          sx: {
            marginLeft: 0,
            ...(icon &&
              !focused &&
              !hasValue && {
                marginLeft: 4,
              }),
          },
        },
        input: {
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
        },
      }}
      {...props}
    />
  );
}
