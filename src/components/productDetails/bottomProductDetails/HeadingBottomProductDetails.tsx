import { Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function HeadingBottomProductDetails({ children }: Props) {
  return (
    <Typography
      component="span"
      fontWeight={500}
      fontSize={16}
      sx={{ color: (theme) => theme.palette.text.secondary }}>
      {children}
    </Typography>
  );
}
