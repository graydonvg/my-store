import { Box } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export default function CustomDataGridToolbar({ children }: Props) {
  return (
    <GridToolbarContainer sx={{ columnGap: { xs: 0.5, sm: 1 } }}>
      <GridToolbarColumnsButton slotProps={{ button: { sx: { height: '32px' } } }} />
      <GridToolbarFilterButton slotProps={{ button: { sx: { height: '32px' } } }} />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' }, button: { sx: { height: '32px' } } }}
      />
      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined', sx: { height: '32px' } },
        }}
      />
      <Box>{children}</Box>
    </GridToolbarContainer>
  );
}
