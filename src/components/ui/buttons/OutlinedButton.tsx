import { BORDER_RADIUS } from '@/data';
import { Button, ButtonProps, SxProps, Theme, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type CustomButtonProps = ButtonProps & {
  isLoading?: boolean;
  label: ReactNode;
  startIcon?: ReactNode;
  sxStyles?: SxProps<Theme> | undefined;
  isDisabled?: boolean;
};

export default function OutlinedButton({
  isLoading,
  label,
  startIcon,
  sxStyles,
  isDisabled,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      variant="outlined"
      disabled={isDisabled}
      startIcon={
        isLoading ? (
          <PulseLoader
            color={darkMode ? 'white' : 'black'}
            loading={isLoading}
            size={10}
          />
        ) : (
          startIcon
        )
      }
      sx={{
        height: '48px',
        borderRadius: BORDER_RADIUS,
        color: theme.palette.text.primary,
        borderColor: theme.palette.text.primary,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.text.primary,
        },
        '&:active': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.text.primary,
        },
        ...sxStyles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
