'use client';

import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  quantity: number;
  size: string;
};

export default function SelectionDetailsSmallCartItem({ quantity, size }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[
        { label: 'QTY', value: quantity },
        { label: 'Size', value: size },
      ].map((item) => (
        <Box
          key={item.label}
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography
            lineHeight={1}
            component="span"
            fontSize={13}
            color={colorPalette.typographyVariants.grey}>
            {item.label}:
          </Typography>
          <Typography
            lineHeight={1}
            component="span"
            fontWeight={600}
            fontSize={13}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
