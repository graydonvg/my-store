import { Box, useTheme } from '@mui/material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import CreateUserDialogButton from './CreateUserDialogButton';
import { DeleteForever } from '@mui/icons-material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import CreateUserDialog from '@/components/dialogs/CreateUserDialog';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsDialogLoading } from '@/lib/redux/features/dialog/dialogSelectors';

type Props = {
  isDeleting: boolean;
  isUpdating: boolean;
  onDeleteClick: () => void;
  numberOfSelectedRows: number;
};

export default function UsersDataGridToolbar({ isDeleting, isUpdating, onDeleteClick, numberOfSelectedRows }: Props) {
  const theme = useTheme();
  const isDialogLoading = useAppSelector(selectIsDialogLoading);
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
        {numberOfSelectedRows > 0 ? (
          <ContainedButton
            label={!isDeleting ? 'delete' : ''}
            startIcon={<DeleteForever />}
            color="secondary"
            onClick={onDeleteClick}
            isLoading={isDeleting}
            disabled={isDeleting || isUpdating}
            sxStyles={{ height: '32px', minHeight: '32px', minWidth: '124.53px' }}
          />
        ) : (
          <>
            <CreateUserDialogButton />
            <CreateUserDialog>
              <ContainedButton
                label="create user"
                disabled={isDialogLoading || isDeleting || isUpdating}
                type="submit"
                sxStyles={{
                  marginTop: 3,
                  marginBottom: 3,
                }}
                fullWidth
                color="secondary"
              />
            </CreateUserDialog>
          </>
        )}
      </Box>
    </GridToolbarContainer>
  );
}
