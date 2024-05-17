import { ChangeEvent, FormEvent } from 'react';
import { UpdateAddressDb, AddressStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/features/addressForm/addressFormSlice';
import { updateUserAddress } from '@/services/users/update';
import AddressForm from '../AddressForm';

export default function UpdateAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector((state) => state.addressForm);
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof AddressStore, value }));
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(setIsDialogLoading(true));

    const { success, message } = await updateUserAddress({
      ...addressFormData,
      postalCode: Number(addressFormData.postalCode),
    } as UpdateAddressDb);

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
      headerText="Edit address"
      addressFormData={addressFormData}
      onInputChange={handleInputChange}
      onSubmit={handleUpdateAddress}
      isDialogLoading={isDialogLoading}
    />
  );
}
