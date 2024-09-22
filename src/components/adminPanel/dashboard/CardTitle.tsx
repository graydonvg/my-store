import Typography, { TypographyProps } from '@mui/material/Typography';
import { ReactNode } from 'react';

type Props = TypographyProps & {
  children: ReactNode;
};

export default function CardTitle({ children, ...props }: Props) {
  return (
    <Typography
      component="h2"
      variant="subtitle2"
      {...props}>
      {children}
    </Typography>
  );
}
