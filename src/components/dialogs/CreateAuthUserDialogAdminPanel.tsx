import DialogComponent from './DialogComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import CreateAuthUserFormAdminPanel from '../forms/CreateAuthUserFormAdminPanel';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';

export default function CreateAuthUserDialogAdminPanel() {
  const dispatch = useAppDispatch();
  const isAddUserDialogOpen = useAppSelector((state) => state.dialog.addUserDialog);

  function openAddUserDialog() {
    dispatch(openDialog('addUserDialog'));
  }

  return (
    <>
      <ContainedButton
        label="add user"
        startIcon={<Add />}
        color="primary"
        onClick={openAddUserDialog}
        sxStyles={{ height: '32px', minHeight: '32px' }}
      />
      <DialogComponent isOpen={isAddUserDialogOpen}>
        <CreateAuthUserFormAdminPanel />
      </DialogComponent>
    </>
  );
}
