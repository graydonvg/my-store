import { CONSTANTS } from '@/constants';
import { InputAdornment, MenuItem, SxProps, TextField, TextFieldProps, Theme, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';

type Props = TextFieldProps & {
  icon?: ReactNode;
  hasValue: boolean;
  sxStyles?: SxProps<Theme>;
  selectOptions?: string[];
};

export default function CustomTextField({ icon, hasValue, sxStyles, selectOptions, ...props }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextField
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      sx={{
        borderRadius: CONSTANTS.BORDER_RADIUS,

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
            border: `2px solid ${theme.palette.custom.textField.focused}`,
            '&:hover': {
              border: `1px solid ${theme.palette.custom.textField.hover}`,
            },
          },
        },

        ...(props.type === 'number' && {
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none',
          },

          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }),

        ...(props.error && {
          '& label': {
            color: theme.palette.error.main,
          },

          '& label.Mui-focused': {
            color: theme.palette.error.main,
          },

          '& fieldset': {
            borderColor: theme.palette.error.main,
          },

          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: theme.palette.error.main,
            },

            '&.Mui-focused fieldset': {
              borderColor: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.main,
              },
            },
          },
        }),

        ...sxStyles,
      }}
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
                ...(props.error && { color: theme.palette.error.main }),
              }}>
              {icon}
            </InputAdornment>
          ) : null,
        },
      }}
      {...props}>
      {props.select &&
        selectOptions?.map((option) => (
          <MenuItem
            key={option}
            value={option}>
            {option}
          </MenuItem>
        ))}
    </TextField>
  );
}
