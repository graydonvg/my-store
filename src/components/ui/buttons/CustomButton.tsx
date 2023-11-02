import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import useCustomColorPalette, { CustomColorPaletteReturnType } from '@/hooks/useCustomColorPalette';
import { Button } from '@mui/material';
import { ElementType, ReactNode } from 'react';

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

type CustomButtonProps = {
  label: ReactNode;
  backgroundColor?: ButtonBackgroundColorType;
  startIcon?: ReactNode;
  component?: ElementType<any>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  styles?: any;
  fullWidth: boolean;
  onClick?: () => void;
};

export default function CustomButton({
  label,
  backgroundColor,
  startIcon,
  type,
  disabled,
  styles,
  fullWidth,
  component,
  onClick,
}: CustomButtonProps) {
  const color = useCustomColorPalette();
  const buttonBackgroundColor = backgroundColor && !disabled ? getButtonBackgroundColor(backgroundColor, color) : null;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      component={component ?? 'button'}
      type={type}
      fullWidth={fullWidth}
      variant="contained"
      startIcon={startIcon}
      sx={{
        color: 'white',
        height: '48px',
        ...buttonBackgroundColor,
        ...styles,
      }}>
      {label}
    </Button>
  );
}
