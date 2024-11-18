'use client';

import { Box, Typography } from '@mui/material';

type Props = {
  label: string;
};

export default function PageHeaderWithBorder({ label }: Props) {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        marginBottom: 3,
        borderTop: `1px solid ${theme.palette.custom.border}`,
        borderBottom: `1px solid ${theme.palette.custom.border}`,
      })}>
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
