'use client';

import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';

type Props = {
  quantity: number;
  size: string;
};

export default function LargeCartItemSelectionDetails({ quantity, size }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'Qauntity', value: quantity },
        { label: 'Size', value: size },
      ].map((item) => (
        <Box
          key={item.label}
          sx={{ display: 'flex', gap: 1, alignItems: 'center', paddingRight: 2 }}>
          <Typography
            lineHeight={1}
            component="span"
            fontSize={{ xs: 14, sm: 16 }}
            fontWeight={600}
            color={colorPalette.typographyVariants.grey}>
            {item.label}:
          </Typography>
          <Typography
            lineHeight={1}
            component="span"
            fontSize={16}
            fontWeight={600}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
