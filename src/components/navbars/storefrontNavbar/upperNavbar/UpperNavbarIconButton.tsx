import { ButtonProps, IconButton } from '@mui/material';
import { ReactNode } from 'react';

type Props = ButtonProps & {
  children: ReactNode;
};

export default function UpperNavbarIconButton({ children, ...props }: Props) {
  return (
    <IconButton
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        paddingX: { xs: 0, md: 2 },
        borderRadius: 0,
        backgroundColor: theme.palette.custom.navbar.upper.background,
        '&:hover': {
          backgroundColor: theme.palette.custom.navbar.upper.background,
        },
      })}
      {...props}>
      {children}
    </IconButton>
  );
}
