'use client';

import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { BORDER_RADIUS } from '@/config';

type Props = {
  percentage: number;
};

export default function SmallCartItemSalePercentageBadge({ percentage }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: BORDER_RADIUS,
        paddingX: 1,
        backgroundColor: colorPalette.primary.dark,
        width: 'fit-content',
        height: 'fit-content',
      }}>
      <Typography
        lineHeight={1.6}
        component="span"
        sx={{
          color: colorPalette.typographyVariants.white,
        }}
        fontSize={14}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}
