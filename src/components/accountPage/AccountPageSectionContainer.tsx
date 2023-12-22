import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function AccountPageSectionContainer({ title, children }: Props) {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        component="h2"
        fontSize={24}
        fontWeight={600}
        sx={{ marginBottom: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
