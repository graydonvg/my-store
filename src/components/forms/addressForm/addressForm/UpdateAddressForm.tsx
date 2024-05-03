import { ChangeEvent, FormEvent } from 'react';
import { UpdateAddressTypeDb, AddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/slices/addressFormSlice';
import { updateAddress } from '@/services/users/update';
import AddressForm from '../AddressForm';

export default function UpdateAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector((state) => state.addressForm);
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof AddressTypeStore, value }));
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(setIsDialogLoading(true));

    const { success, message } = await updateAddress({
      ...addressFormData,
      postalCode: Number(addressFormData.postalCode),
    } as UpdateAddressTypeDb);

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
      onSubmit={handleUpdateAddress}
      isDialogLoading={isDialogLoading}
    />
  );
}
