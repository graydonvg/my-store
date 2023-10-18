import { Button } from '@mui/material';
import { ElementType, ReactNode } from 'react';

type CustomButtonProps = {
  label: ReactNode;
  startIcon?: ReactNode;
  component?: ElementType<any>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  styles?: Record<string, string | number | Record<string, string | number>>;
  fullWidth: boolean;
  onClick?: () => void;
};

export default function CustomButton({
  label,
  startIcon,
  type,
  disabled,
  styles,
  fullWidth,
  component,
  onClick,
}: CustomButtonProps) {
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
        height: '48px',
        ...styles,
      }}>
      {label}
    </Button>
  );
}
