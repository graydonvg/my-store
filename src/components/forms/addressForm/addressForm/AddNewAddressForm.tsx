import { ChangeEvent, FormEvent } from 'react';
import { addNewAddress } from '@/services/users/add';
import { AddressStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/slices/addressFormSlice';
import AddressForm from '../AddressForm';

export default function AddNewAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector((state) => state.addressForm);
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

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
      toast.success(message);
    } else {
      toast.error(message);
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <AddressForm
      addressFormData={addressFormData}
      onInputChange={handleInputChange}
      onSubmit={handleAddNewAddress}
      isDialogLoading={isDialogLoading}
    />
  );
}
