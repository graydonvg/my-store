import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DialogComponent from '../DialogComponent';
import UpdateAddressForm from '@/components/forms/addressForm/addressForm/UpdateAddressForm';
import AddressButton from '@/components/addresses/AddressButton';
import { setAddressFormData } from '@/lib/redux/slices/addressFormSlice';
import { UpdateAddressTypeStore } from '@/types';
import { setIsUpdateAddressDialogOpen } from '@/lib/redux/slices/dialogSlice';

type Props = {
  addressId: string;
};

export default function UpdateAddressDialog({ addressId }: Props) {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const isUpdateAddressDialogOpen = useAppSelector((state) => state.dialog.isUpdateAddressDialogOpen);

  async function handleSetAddressToEdit() {
    const addressToEdit = userData?.addresses.filter((address) => address.addressId === addressId)[0];

    dispatch(setAddressFormData(addressToEdit as UpdateAddressTypeStore));
    dispatch(setIsUpdateAddressDialogOpen(true));
  }

  return (
    <>
      <AddressButton
        label="edit"
        onClick={handleSetAddressToEdit}
      />
      <DialogComponent isOpen={isUpdateAddressDialogOpen}>
        <UpdateAddressForm />
      </DialogComponent>
    </>
  );
}
