'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Box, Typography } from '@mui/material';

type Props = {
  label: string;
};

export default function PageHeaderWithBorder({ label }: Props) {
  const customColorPalette = useCustomColorPalette();

  return (
    <Box
      component="header"
      sx={{
        marginBottom: 3,
        borderTop: `1px solid ${customColorPalette.border}`,
        borderBottom: `1px solid ${customColorPalette.border}`,
      }}>
      <Typography
        component="h1"
        fontSize={{ xs: 26, sm: 30 }}
        fontWeight={500}
        sx={{ paddingY: 1, textAlign: 'center' }}>
        {label}
      </Typography>
    </Box>
  );
}
