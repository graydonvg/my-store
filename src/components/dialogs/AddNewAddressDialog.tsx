import DialogComponent from '../ui/DialogComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddAddressForm from '../forms/AddAddressForm';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';
import { setIsAddAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';

export default function AddNewAddressDialog() {
  const dispatch = useAppDispatch();
  const { isAddAddressDialogOpen } = useAppSelector((state) => state.dialog);

  function handleOpenAddAddressDialog() {
    dispatch(setIsAddAddressDialogOpen(true));
  }

  return (
    <>
      <ContainedButton
        onClick={handleOpenAddAddressDialog}
        label="add new address"
        styles={{ width: 'fit-content' }}
        fullWidth={false}
        startIcon={<Add />}
        backgroundColor="blue"
      />
      <DialogComponent isOpen={isAddAddressDialogOpen}>
        <AddAddressForm />
      </DialogComponent>
    </>
  );
}
