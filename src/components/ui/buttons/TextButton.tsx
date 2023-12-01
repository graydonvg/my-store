import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

type Props = ButtonProps & {
  label: string;
  labelColor: string;
  startIcon?: ReactNode;
};

export default function TextButton({ label, labelColor, startIcon, ...props }: Props) {
  return (
    <Button
      variant="text"
      sx={{
        height: 1,
        paddingX: { xs: 0, md: 2 },
        color: labelColor,
        whiteSpace: 'nowrap',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
      startIcon={startIcon}
      {...props}>
      {label}
    </Button>
  );
}
