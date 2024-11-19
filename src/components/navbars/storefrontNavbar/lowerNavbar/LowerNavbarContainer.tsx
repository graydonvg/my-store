'use client';

import { Box } from '@mui/material';
import CommonNavbarContainer from '@/components/navbars/CommonNavbarContainer';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function LowerNavbarContainer({ children }: Props) {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        backgroundColor: (theme) => theme.palette.custom.navbar.lower.background,
      }}>
      <CommonNavbarContainer>
        <Box
          component="nav"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            position: 'relative',
            height: '56px',
          }}>
          {children}
        </Box>
      </CommonNavbarContainer>
    </Box>
  );
}
