import { constants } from '@/constants';
import { InputAdornment, TextField, TextFieldProps, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

type Props = {
  icon?: ReactNode;
  backgroundColor?: string;
  hasValue: boolean;
} & TextFieldProps;

export default function CustomTextField({ icon, backgroundColor, hasValue, ...props }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextField
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={{
        borderRadius: constants.borderRadius,
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
      }}
      InputLabelProps={{
        shrink: focused || hasValue,
        sx: {
          marginLeft: 0,
          ...(icon &&
            !focused &&
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
      {...props}
    />
  );
}
