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
    blue: {
      backgroundColor: colorPalette.primary.dark,
      '&:hover': {
        backgroundColor: colorPalette.primary.dark,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: colorPalette.primary.light,
        },
      },
    },
    red: {
      backgroundColor: colorPalette.warning.dark,
      '&:hover': {
        backgroundColor: colorPalette.warning.dark,
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
  isDisabled?: boolean;
};

export default function ContainedButton({
  height,
  minHeight = '48px',
  isLoading,
  label,
  backgroundColor,
  startIcon,
  styles,
  isDisabled,
  ...props
}: ContainedButtonProps) {
  const colorPalette = useColorPalette();
  const buttonBackgroundColor =
    backgroundColor && !isDisabled ? getButtonBackgroundColor(backgroundColor, colorPalette) : null;

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
