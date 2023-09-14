import Button, { ButtonProps } from '@mui/material/Button';
import { ReactNode, forwardRef } from 'react';

type CustomButtonProps = ButtonProps & {
  paddingX?: number;
  textColor?: string;
  hoverBackgroundColor: string;
  children?: ReactNode;
};

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(function MyComponent(props, ref) {
  const { children, textColor, paddingX, hoverBackgroundColor } = props;
  return (
    <Button
      disableTouchRipple
      sx={{
        display: 'flex',
        whiteSpace: 'nowrap',
        color: textColor,
        margin: 0,
        '&:hover': { backgroundColor: hoverBackgroundColor },
        paddingX,
      }}
      {...props}
      ref={ref}>
      {children}
    </Button>
  );
});

export default CustomButton;
