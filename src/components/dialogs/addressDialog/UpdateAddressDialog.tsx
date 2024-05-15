import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DialogComponent from '../DialogComponent';
import UpdateAddressForm from '@/components/forms/addressForm/addressForm/UpdateAddressForm';
import AddressButton from '@/components/addresses/AddressButton';
import { setAddressFormData } from '@/lib/redux/slices/addressFormSlice';
import { openDialog } from '@/lib/redux/slices/dialogSlice';
import { AddressStore } from '@/types';

type Props = {
  addressId: string;
};

export default function UpdateAddressDialog({ addressId }: Props) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector((state) => state.addresses.data);
  const isUpdateAddressDialogOpen = useAppSelector((state) => state.dialog.updateAddressDialog);

  async function selectAddressToEdit() {
    const addressToEdit = addresses?.filter((address) => address.addressId === addressId)[0];

    dispatch(setAddressFormData(addressToEdit as AddressStore));
    dispatch(openDialog('updateAddressDialog'));
  }

  return (
    <>
      <AddressButton
        label="edit"
        onClick={selectAddressToEdit}
      />
      <DialogComponent isOpen={isUpdateAddressDialogOpen}>
        <UpdateAddressForm />
      </DialogComponent>
    </>
  );
}
