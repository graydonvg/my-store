import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Add } from '@mui/icons-material';
import { setIsAddNewAddressDialogOpen } from '@/lib/redux/slices/dialogSlice';
import { clearAddressFormData } from '@/lib/redux/slices/addressFormSlice';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import DialogComponent from '../DialogComponent';
import AddNewAddressForm from '@/components/forms/addressForm/addressForm/AddNewAddressForm';

export default function AddNewAddressDialog() {
  const dispatch = useAppDispatch();
  const isAddNewAddressDialogOpen = useAppSelector((state) => state.dialog.isAddNewAddressDialogOpen);
  const addressFormData = useAppSelector((state) => state.addressForm);

  function handleOpenAddAddressDialog() {
    if (addressFormData.addressId) {
      dispatch(clearAddressFormData());
    }
    dispatch(setIsAddNewAddressDialogOpen(true));
  }

  return (
    <>
      <ContainedButton
        onClick={handleOpenAddAddressDialog}
        label="add new address"
        styles={{ width: 'fit-content' }}
        fullWidth={false}
        startIcon={<Add />}
        backgroundColor="primary"
      />
      <DialogComponent isOpen={isAddNewAddressDialogOpen}>
        <AddNewAddressForm />
      </DialogComponent>
    </>
  );
}
