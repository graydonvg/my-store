import { CONSTANTS } from '@/constants';
import { Button, ButtonProps, SxProps, Theme, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type CustomButtonProps = ButtonProps & {
  isLoading?: boolean;
  label: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function OutlinedButton({
  isLoading,
  label,
  startIcon,
  endIcon,
  sxStyles,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      variant="outlined"
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
      endIcon={endIcon}
      sx={{
        pointerEvents: !isLoading ? 'auto' : 'none',
        minHeight: '48px',
        borderRadius: CONSTANTS.BORDER_RADIUS,
        color: theme.palette.text.primary,
        borderColor: theme.palette.text.primary,
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: theme.palette.text.primary,
        },
        '@media (hover: hover)': {
          '&:hover': {
            color: theme.palette.background.default,
            backgroundColor: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          },
        },
        '&:active': {
          color: theme.palette.background.default,
          backgroundColor: 'transparent',
          borderColor: theme.palette.text.primary,
        },
        ...sxStyles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
