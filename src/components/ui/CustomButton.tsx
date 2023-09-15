import Button, { ButtonProps } from '@mui/material/Button';
import { ReactNode } from 'react';

type CustomButtonProps = ButtonProps & {
  paddingX?: number;
  textColor?: string;
  hoverBackgroundColor: string;
  children?: ReactNode;
};

export default function CustomButton({
  children,
  textColor,
  paddingX,
  hoverBackgroundColor,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      disableTouchRipple
      sx={{
        height: 1,
        display: 'flex',
        whiteSpace: 'nowrap',
        color: textColor,
        margin: 0,
        '&:hover': { backgroundColor: hoverBackgroundColor },
        paddingX,
      }}
      {...props}>
      {children}
    </Button>
  );
}
