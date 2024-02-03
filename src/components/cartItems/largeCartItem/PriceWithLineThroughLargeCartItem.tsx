'use client';

import { Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';

type Props = {
  price: number;
};

export default function PriceWithLineThroughLargeCartItem({ price }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Typography
      lineHeight={1}
      component="span"
      fontSize={{ xs: 20, sm: 24 }}
      fontWeight={400}
      color={colorPalette.typographyVariants.grey}
      sx={{ textDecoration: 'line-through' }}>
      {formatCurrency(price)}
    </Typography>
  );
}
