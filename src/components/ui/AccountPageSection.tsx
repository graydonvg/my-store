import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function AccountPageSection({ title, children }: Props) {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        component="h2"
        fontSize={24}
        fontWeight={600}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
