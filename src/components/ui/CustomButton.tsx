import Button, { ButtonProps } from '@mui/material/Button';
import { ReactNode, forwardRef } from 'react';

type CustomButtonProps = ButtonProps & {
  textColor?: string;
  hoverBackgroundColor: string;
  content?: ReactNode;
};

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(function MyComponent(props, ref) {
  const { content, textColor, hoverBackgroundColor } = props;
  return (
    <Button
      disableTouchRipple
      sx={{
        display: 'block',
        whiteSpace: 'nowrap',
        color: textColor,
        margin: 0,
        '&:hover': { backgroundColor: hoverBackgroundColor },
      }}
      {...props}
      ref={ref}>
      {content}
    </Button>
  );
});

export default CustomButton;
