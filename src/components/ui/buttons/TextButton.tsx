import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Button, ButtonProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type Props = ButtonProps & {
  label: string;
  labelColor: string;
  startIcon?: ReactNode;
  isLoading?: boolean;
};

export default function TextButton({ label, labelColor, startIcon, isLoading, ...props }: Props) {
  return (
    <Button
      variant="text"
      sx={{
        height: '48px',
        paddingX: { xs: 0, md: 2 },
        color: labelColor,
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      startIcon={
        isLoading ? (
          <PulseLoader
            color={labelColor}
            loading={isLoading}
            size={10}
          />
        ) : (
          startIcon
        )
      }
      {...props}>
      {label}
    </Button>
  );
}
