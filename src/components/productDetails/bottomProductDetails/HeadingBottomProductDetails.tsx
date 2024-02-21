import useColorPalette from '@/hooks/useColorPalette';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function HeadingBottomProductDetails({ children }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Typography
      component="span"
      fontWeight={500}
      fontSize={16}
      color={colorPalette.typographyVariants.grey}>
      {children}
    </Typography>
  );
}
