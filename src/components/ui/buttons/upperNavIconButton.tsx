import { ButtonProps, IconButton } from '@mui/material';
import { ReactNode } from 'react';

type Props = ButtonProps & {
  backgroundColor: string;
  children: ReactNode;
};

export default function UpperNavIconButton({ backgroundColor, children, ...props }: Props) {
  return (
    <IconButton
      sx={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        paddingX: { xs: 0, md: 2 },
        borderRadius: 0,
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: backgroundColor,
        },
      }}
      {...props}>
      {children}
    </IconButton>
  );
}
