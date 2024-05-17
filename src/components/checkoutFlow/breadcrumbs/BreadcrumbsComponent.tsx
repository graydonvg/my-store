import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavigateNext } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function BreadcrumbsComponent({ children }: Props) {
  return (
    <Box role="navigation">
      <Breadcrumbs
        separator={
          <NavigateNext
            fontSize="large"
            sx={{ color: (theme) => theme.palette.grey[600] }}
          />
        }
        aria-label="breadcrumb">
        {children}
      </Breadcrumbs>
    </Box>
  );
}
