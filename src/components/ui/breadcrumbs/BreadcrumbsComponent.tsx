'use client';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavigateNext } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type Props = {
  children: ReactNode;
};

export default function BreadcrumbsComponent({ children }: Props) {
  const customColor = useCustomColorPalette();

  return (
    <Box role="presentation">
      <Breadcrumbs
        separator={
          <NavigateNext
            fontSize="large"
            sx={{ color: customColor.shade.medium }}
          />
        }
        aria-label="breadcrumb">
        {children}
      </Breadcrumbs>
    </Box>
  );
}
