import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { Button, ButtonProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type CustomButtonProps = ButtonProps & {
  isLoading?: boolean;
  label: ReactNode;
  startIcon?: ReactNode;
  styles?: any;
  isDisabled?: boolean;
};

export default function OutlinedButton({
  isLoading,
  label,
  startIcon,
  styles,
  isDisabled,
  ...props
}: CustomButtonProps) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Button
      variant="outlined"
      disabled={isDisabled}
      startIcon={
        isLoading ? (
          <PulseLoader
            color={mode === 'dark' ? 'white' : 'black'}
            loading={isLoading}
            size={10}
          />
        ) : (
          startIcon
        )
      }
      sx={{
        color: colorPalette.typography,
        height: '48px',
        borderColor: colorPalette.typography,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          borderColor: colorPalette.typography,
        },
        '&:active': {
          backgroundColor: 'transparent',
          borderColor: colorPalette.typography,
        },
        borderRadius: BORDER_RADIUS,
        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
