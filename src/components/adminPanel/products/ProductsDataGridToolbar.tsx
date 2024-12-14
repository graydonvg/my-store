import { Box, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { DeleteForever } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import AddNewProductButton from './AddNewProductButton';
import RevalidateButton from './RevalidateButton';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

type Props = {
  isDeleting: boolean;
  onDeleteClick: () => void;
  numberOfSelectedRows: number;
};

export default function ProductsDataGridToolbar({ isDeleting, onDeleteClick, numberOfSelectedRows }: Props) {
  const userData = useAppSelector(selectUserData);
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const commonStyle = { height: '32px', color: darkMode ? theme.palette.primary.light : theme.palette.primary.main };

  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', columnGap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
        {userData?.role === 'owner' || userData?.role === 'manager' ? (
          <RevalidateButton
            commonStyle={commonStyle}
            isDeleting={isDeleting}
          />
        ) : null}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
            disabled={isDeleting}
            sxStyles={{ height: '32px', minHeight: '32px', minWidth: '154.56px' }}
          />
        ) : (
          <AddNewProductButton isDeleting={isDeleting} />
        )}
      </Box>
    </GridToolbarContainer>
  );
}
