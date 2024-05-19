import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
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
        sx={{ [`& .${breadcrumbsClasses.separator}`]: { marginX: { xs: 0, sm: 0.5, md: 1 } } }}
        separator={
          <NavigateNext sx={{ color: (theme) => theme.palette.grey[600], fontSize: { xs: 24, sm: 32, md: 35 } }} />
        }
        aria-label="breadcrumb">
        {children}
      </Breadcrumbs>
    </Box>
  );
}
