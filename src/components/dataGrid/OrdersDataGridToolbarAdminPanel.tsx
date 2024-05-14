import { Box, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

export default function OrdersDataGridToolbarAdminPanel() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const commonStyle = { height: '32px', color: darkMode ? theme.palette.primary.light : theme.palette.primary.main };

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap' }}>
        <GridToolbarColumnsButton
          slotProps={{
            tooltip: { disableHoverListener: true, disableFocusListener: true, disableTouchListener: true },
            button: {
              sx: { ...commonStyle },
            },
          }}
        />
        <GridToolbarFilterButton
          slotProps={{
            tooltip: { disableHoverListener: true, disableFocusListener: true, disableTouchListener: true },
            button: {
              sx: { ...commonStyle },
            },
          }}
        />
        <GridToolbarDensitySelector
          slotProps={{
            tooltip: { disableHoverListener: true, disableFocusListener: true, disableTouchListener: true },
            button: {
              sx: { ...commonStyle },
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <GridToolbarExport
          slotProps={{
            tooltip: { disableHoverListener: true, disableFocusListener: true, disableTouchListener: true },
            button: {
              variant: 'outlined',
              sx: { ...commonStyle },
            },
          }}
        />
      </Box>
    </GridToolbarContainer>
  );
}
