'use client';

import { Box } from '@mui/material';
import CommonNavbarContainer from '@/components/ui/containers/CommonNavbarContainer';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function UpperNavbarContainer({ children }: Props) {
  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.custom.navbar.upper.background }}>
      <CommonNavbarContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
            height: { xs: '64px', md: '42px' },
          }}>
          {children}
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
