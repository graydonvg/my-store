import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Add } from '@mui/icons-material';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { clearAddressFormData } from '@/lib/redux/features/addressForm/addressFormSlice';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';

export default function AddAddressDialogButton() {
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector(selectAddressFromData);

  function openAddAddressDialog() {
    if (addressFormData.addressId) {
      dispatch(clearAddressFormData());
    }
    dispatch(setAccountFieldToEdit(null));
    dispatch(openDialog('addAddressDialog'));
  }

  return (
    <ContainedButton
      onClick={openAddAddressDialog}
      label="add address"
      fullWidth={false}
      startIcon={<Add />}
      color="primary"
    />
  );
}
