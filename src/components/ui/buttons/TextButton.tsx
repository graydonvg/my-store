import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';
import { PulseLoader } from 'react-spinners';

type Props = ButtonProps & {
  label: ReactNode;
  labelColor: string;
  labelColorHoverActive?: string;
  startIcon?: ReactNode;
  isLoading?: boolean;
};

export default function TextButton({
  label,
  labelColor,
  labelColorHoverActive,
  startIcon,
  isLoading,
  ...props
}: Props) {
  return (
    <Button
      variant="text"
      sx={{
        height: '48px',
        paddingX: 0,
        color: labelColor,
        whiteSpace: 'nowrap',
        '&:hover': {
          color: labelColorHoverActive ?? labelColor,
          backgroundColor: 'transparent',
        },
        '&:active': {
          color: labelColorHoverActive ?? labelColor,
          backgroundColor: 'transparent',
        },
      }}
      startIcon={
        isLoading ? (
          <PulseLoader
            color={labelColorHoverActive ?? labelColor}
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
