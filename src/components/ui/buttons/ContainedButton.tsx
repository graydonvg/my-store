import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type ButtonBackgroundColorType = 'blue' | 'red';

function getButtonBackgroundColor(option: ButtonBackgroundColorType, customColorPalette: CustomColorPaletteReturnType) {
  const colorOptions = {
    blue: {
      backgroundColor: customColorPalette.blue.dark,
      '&:hover': {
        backgroundColor: customColorPalette.blue.dark,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: customColorPalette.blue.light,
        },
      },
    },
    red: {
      backgroundColor: customColorPalette.red.dark,
      '&:hover': {
        backgroundColor: customColorPalette.red.dark,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: customColorPalette.red.light,
        },
      },
    },
  };

  return colorOptions[option];
}

type CustomButtonProps = ButtonProps & {
  isLoading?: boolean;
  label: ReactNode;
  backgroundColor?: ButtonBackgroundColorType;
  startIcon?: ReactNode;
  styles?: any;
  isDisabled?: boolean;
};

export default function ContainedButton({
  isLoading,
  label,
  backgroundColor,
  startIcon,
  styles,
  isDisabled,
  ...props
}: CustomButtonProps) {
  const customColorPalette = useCustomColorPalette();
  const buttonBackgroundColor =
    backgroundColor && !isDisabled ? getButtonBackgroundColor(backgroundColor, customColorPalette) : null;

  return (
    <Button
      variant="contained"
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
        color: 'white',
        height: '48px',
        ...buttonBackgroundColor,
        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}