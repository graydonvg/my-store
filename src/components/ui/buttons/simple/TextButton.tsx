import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type Props = ButtonProps & {
  label: ReactNode;
  loaderColor?: string;
  startIcon?: ReactNode;
  isLoading?: boolean;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function TextButton({ label, loaderColor, startIcon, isLoading, sxStyles, ...props }: Props) {
  return (
    <Button
      variant="text"
      startIcon={
        isLoading ? (
          <PulseLoader
            color={loaderColor}
            loading={isLoading}
            size={10}
          />
        ) : (
          startIcon
        )
      }
      sx={{
        height: '48px',
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:active': {
          backgroundColor: 'transparent',
        },
        ...sxStyles,
      }}
      {...props}>
      {label}
    </Button>
  );
}
