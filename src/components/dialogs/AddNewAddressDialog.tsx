import DialogComponent from './DialogComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressForm from '../forms/AddressForm';
import ContainedButton from '../ui/buttons/ContainedButton';
import { Add } from '@mui/icons-material';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { clearAddressFormData } from '@/lib/redux/addressForm/addressFormSlice';

export default function AddNewAddressDialog() {
  const dispatch = useAppDispatch();
  const { isAddAddressDialogOpen } = useAppSelector((state) => state.dialog);
  const addressFormData = useAppSelector((state) => state.addressForm);

  function handleOpenAddAddressDialog() {
    if (addressFormData.addressId) {
      dispatch(clearAddressFormData());
    }
    dispatch(setIsAddressDialogOpen(true));
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
        <AddressForm />
      </DialogComponent>
    </>
  );
}
