'use client';

import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function LowerNavbarContainer({ children }: Props) {
  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.custom.navbar.lower.background }}>
      <CommonNavbarContainer>{children}</CommonNavbarContainer>
    </Box>
  );
}
