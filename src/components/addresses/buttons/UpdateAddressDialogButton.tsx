import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressButton from '@/components/addresses/buttons/AddressButton';
import { setAddressFormData } from '@/lib/redux/features/addressForm/addressFormSlice';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { selectAddresses } from '@/lib/redux/features/addresses/addressesSelectors';
import { AddressStore } from '@/types';

type Props = {
  addressId: string;
};

export default function UpdateAddressDialogButton({ addressId }: Props) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);

  async function selectAddressToEdit() {
    const addressToEdit = addresses?.filter((address) => address.addressId === addressId)[0];

    dispatch(setAddressFormData(addressToEdit as AddressStore));
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
