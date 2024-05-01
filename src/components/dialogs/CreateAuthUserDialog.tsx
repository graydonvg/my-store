import DialogComponent from './DialogComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import CreateAuthUserForm from '../forms/CreateAuthUserForm';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';

export default function CreateAuthUserDialog() {
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
        <CreateAuthUserForm />
      </DialogComponent>
    </>
  );
}
