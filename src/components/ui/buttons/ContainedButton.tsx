import { CONSTANTS } from '@/constants';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type ContainedButtonProps = ButtonProps & {
  isLoading?: boolean;
  label: ReactNode;
  startIcon?: ReactNode;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function ContainedButton({ isLoading, label, startIcon, sxStyles, ...props }: ContainedButtonProps) {
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
        pointerEvents: !isLoading ? 'auto' : 'none',
        borderRadius: CONSTANTS.BORDER_RADIUS,
        minHeight: '48px',
        ...sxStyles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
