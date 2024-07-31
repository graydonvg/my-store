import { Box, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { DeleteForever } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/simple/ContainedButton';
import AddNewProductButton from './AddNewProductButton';
import RevalidateButton from './RevalidateButton';

type Props = {
  isDeleting: boolean;
  onDeleteClick: () => void;
  numberOfSelectedRows: number;
};

export default function ProductsDataGridToolbar({ isDeleting, onDeleteClick, numberOfSelectedRows }: Props) {
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
        <RevalidateButton commonStyle={commonStyle} />
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
        {numberOfSelectedRows > 0 ? (
          <ContainedButton
            label={!isDeleting ? 'delete' : ''}
            startIcon={<DeleteForever />}
            color="secondary"
            onClick={onDeleteClick}
            isLoading={isDeleting}
            sxStyles={{ height: '32px', minHeight: '32px', minWidth: '154.56px' }}
          />
        ) : (
          <AddNewProductButton />
        )}
      </Box>
    </GridToolbarContainer>
  );
}
