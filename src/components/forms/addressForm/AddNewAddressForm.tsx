import { ChangeEvent, FormEvent } from 'react';
import { addNewAddress } from '@/services/users/add';
import { AddressStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/features/addressForm/addressFormSlice';
import AddressForm from './AddressForm';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';

export default function AddNewAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector(selectAddressFromData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof AddressStore, value }));
  }

  async function handleAddNewAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { addressId, postalCode, ...restOfAddressData } = addressFormData;

    dispatch(setIsDialogLoading(true));

    const { success, message } = await addNewAddress({
      ...restOfAddressData,
      postalCode: Number(postalCode),
    });

    if (success === true) {
      router.refresh();
      dispatch(closeDialog());
      dispatch(clearAddressFormData());
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setIsDialogLoading(false));
  }

  return (
    <AddressForm
      headerText="Add address"
      onInputChange={handleInputChange}
      onSubmit={handleAddNewAddress}
    />
  );
}
