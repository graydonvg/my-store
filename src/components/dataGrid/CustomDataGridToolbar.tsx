import { Box, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const commonStyle = { height: '32px', color: darkMode ? theme.palette.primary.light : theme.palette.primary.main };

  return (
    <GridToolbarContainer sx={{ columnGap: 1 }}>
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
      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { disableHoverListener: true, disableFocusListener: true, disableTouchListener: true },
          button: {
            variant: 'outlined',
            sx: { ...commonStyle },
          },
        }}
      />
      <Box>{children}</Box>
    </GridToolbarContainer>
  );
}
