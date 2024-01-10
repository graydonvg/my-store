import useColorPalette from '@/hooks/useColorPalette';
import { Button, ButtonProps } from '@mui/material';
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

  return (
    <Button
      variant="outlined"
      disabled={isDisabled}
      startIcon={
        isLoading ? (
          <PulseLoader
            color="white"
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
        },
        '&:active': {
          backgroundColor: 'transparent',
        },
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: colorPalette.typography,
          },
        },

        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
