'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { Box, Typography, useTheme } from '@mui/material';

type Props = {
  label: string;
};

export default function PageHeaderWithBorder({ label }: Props) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? customColorPalette.white.opacity.light : customColorPalette.black.opacity.light;
  return (
    <Box
      component="header"
      sx={{ marginBottom: 3, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
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
