import { useAppDispatch } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';

export default function CreateAuthUserDialogButton() {
  const dispatch = useAppDispatch();

  function openAddUserDialog() {
    dispatch(openDialog('addUserDialog'));
  }

  return (
    <ContainedButton
      label="add user"
      startIcon={<Add />}
      color="primary"
      onClick={openAddUserDialog}
      sxStyles={{ height: '32px', minHeight: '32px' }}
    />
  );
}
