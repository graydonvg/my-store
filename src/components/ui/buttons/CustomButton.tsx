import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { Button, ButtonProps, ButtonTypeMap, ExtendButtonBase } from '@mui/material';
import { ElementType, ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type ButtonBackgroundColorType = 'blue' | 'red';

function getButtonBackgroundColor(option: ButtonBackgroundColorType, color: CustomColorPaletteReturnType) {
  const colorOptions = {
    blue: {
      backgroundColor: color.blue.dark,
      '&:hover': {
        backgroundColor: color.blue.dark,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: color.blue.light,
        },
      },
    },
    red: {
      backgroundColor: color.red.dark,
      '&:hover': {
        backgroundColor: color.red.dark,
      },
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: color.red.light,
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
};

export default function CustomButton({
  isLoading,
  label,
  backgroundColor,
  startIcon,
  styles,
  ...props
}: CustomButtonProps) {
  const color = useCustomColorPalette();
  const buttonBackgroundColor = backgroundColor && getButtonBackgroundColor(backgroundColor, color);

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
        height: '48px',
        ...buttonBackgroundColor,
        ...styles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
