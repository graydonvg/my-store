import { Button, ButtonProps, SxProps, Theme, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  return (
    <Button
      variant="text"
      startIcon={
        isLoading ? (
          <PulseLoader
            color={darkMode ? 'white' : 'black'}
            loading={isLoading}
            size={10}
          />
        ) : (
          startIcon
        )
      }
      sx={{
        pointerEvents: !isLoading ? 'auto' : 'none',
        minHeight: '48px',
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
