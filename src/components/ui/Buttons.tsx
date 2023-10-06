import { Button, useTheme } from '@mui/material';
import { ElementType, ReactNode } from 'react';
import { GetDesignTokensType } from '../Theme/ThemeRegistry';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type BlueFormButtonProps = {
  label: ReactNode;
  startIcon?: ReactNode;
  component?: ElementType<any>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  sx?: Record<string, string | number>;
  fullWidth: boolean;
  onClick?: () => void;
};

export default function BlueFormButton({
  label,
  startIcon,
  type,
  disabled,
  sx,
  fullWidth,
  component,
  onClick,
}: BlueFormButtonProps) {
  const color = useCustomColorPalette();

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
        ...sx,
        backgroundColor: color.blue.dark,
        '&:hover': { backgroundColor: color.blue.light },
      }}>
      {label}
    </Button>
  );
}
