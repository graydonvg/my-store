import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ContainedButton from '../ui/buttons/ContainedButton';

export default function CustomDataGridToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector slotProps={{ tooltip: { title: 'Change density' } }} />
      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      />
      <Box>
        <ContainedButton
          label="add"
          startIcon={<Add />}
          height="30.35px"
          minHeight={1}
          backgroundColor="primary"
        />
      </Box>
    </GridToolbarContainer>
  );
}
