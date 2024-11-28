import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressButton from '@/components/addresses/buttons/AddressButton';
import { setAddressFormData } from '@/lib/redux/features/addressForm/addressFormSlice';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { selectAddresses } from '@/lib/redux/features/addresses/addressesSelectors';
import { toast } from 'react-toastify';

type Props = {
  addressId: number;
};

export default function UpdateAddressDialogButton({ addressId }: Props) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);

  async function selectAddressToEdit() {
    const addressToEdit = addresses?.filter((address) => address.addressId === addressId)[0];

    if (!addressToEdit) {
      toast.error('Address not found');
      return;
    }

    dispatch(setAddressFormData(addressToEdit));
    dispatch(setAccountFieldToEdit(null));
    dispatch(openDialog('updateAddressDialog'));
  }

  return (
    <AddressButton
      label="edit"
      onClick={selectAddressToEdit}
    />
  );
}
