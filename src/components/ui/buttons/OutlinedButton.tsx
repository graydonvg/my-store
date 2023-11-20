import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
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
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const buttondColor = mode === 'dark' ? customColorPalette.grey.light : customColorPalette.grey.dark;

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
        color: buttondColor,
        height: '48px',
        borderColor: buttondColor,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: buttondColor,
          },
        },

        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
