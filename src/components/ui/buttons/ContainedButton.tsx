import useColorPalette, { ColorPaletteReturnType } from '@/hooks/useColorPalette';
import { ContainedButtonButtonBackgroundColorType } from '@/types';
import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

function getButtonBackgroundColor(
  option: ContainedButtonButtonBackgroundColorType,
  colorPalette: ColorPaletteReturnType
) {
  const colorOptions = {
    primary: {
      backgroundColor: colorPalette.primary.dark,
      '&:hover': {
        backgroundColor: colorPalette.primary.dark,
      },
      '&:disabled': {
        backgroundColor: colorPalette.button.disabled.backgroundColor,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: colorPalette.primary.light,
        },
      },
    },
    warning: {
      backgroundColor: colorPalette.warning.dark,
      '&:hover': {
        backgroundColor: colorPalette.warning.dark,
      },
      '&:disabled': {
        backgroundColor: colorPalette.button.disabled.backgroundColor,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: colorPalette.warning.light,
        },
      },
    },
  };

  return colorOptions[option];
}

type ContainedButtonProps = ButtonProps & {
  height?: string | number;
  minHeight?: string | number;
  isLoading?: boolean;
  label: ReactNode;
  backgroundColor?: ContainedButtonButtonBackgroundColorType;
  startIcon?: ReactNode;
  styles?: any;
};

export default function ContainedButton({
  height,
  minHeight = '48px',
  isLoading,
  label,
  backgroundColor,
  startIcon,
  styles,
  ...props
}: ContainedButtonProps) {
  const colorPalette = useColorPalette();
  const buttonBackgroundColor = backgroundColor ? getButtonBackgroundColor(backgroundColor, colorPalette) : null;

  return (
    <Button
      variant="contained"
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
        height,
        minHeight,
        ...buttonBackgroundColor,
        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
