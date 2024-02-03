'use client';

import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';

type Props = {
  price: number;
};

export default function PriceWithLineThroughSmallCartItem({ price }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
      }}>
      <Typography
        lineHeight={1}
        component="span"
        fontSize={16}
        fontWeight={700}
        color={colorPalette.typographyVariants.grey}
        sx={{ textDecoration: 'line-through' }}>
        {formatCurrency(price)}
      </Typography>
    </Box>
  );
}
