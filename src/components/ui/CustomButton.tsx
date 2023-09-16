import Button, { ButtonProps } from '@mui/material/Button';
import { ReactNode } from 'react';

type CustomButtonProps = ButtonProps & {
  children?: ReactNode;
};

export default function CustomButton({ children, ...props }: CustomButtonProps) {
  return (
    <Button
      disableTouchRipple
      sx={{
        height: 1,
        display: 'flex',
        whiteSpace: 'nowrap',
        color: 'custom.grey.light',
        margin: 0,
        '&:hover': { backgroundColor: 'custom.grey.dark' },
        paddingX: 2,
      }}
      {...props}>
      {children}
    </Button>
  );
}
