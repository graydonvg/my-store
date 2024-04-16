import { GetDesignTokensType } from '@/components/theme/ThemeRegistry';
import { BORDER_RADIUS } from '@/config';
import { ContainedButtonButtonBackgroundColorType } from '@/types';
import { Button, ButtonProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

function getButtonBackgroundColor(
  option: ContainedButtonButtonBackgroundColorType,
  colorPalette: GetDesignTokensType['palette']['custom']
) {
  const colorOptions = {
    primary: {
      backgroundColor: colorPalette.primary.dark,
      '&:hover': {
        backgroundColor: colorPalette.primary.dark,
      },
      '&:active': {
        backgroundColor: colorPalette.primary.light,
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
      '&:active': {
        backgroundColor: colorPalette.warning.light,
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
  const theme = useTheme();
  const buttonBackgroundColor = backgroundColor
    ? getButtonBackgroundColor(backgroundColor, theme.palette.custom)
    : null;

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
        borderRadius: BORDER_RADIUS,
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
