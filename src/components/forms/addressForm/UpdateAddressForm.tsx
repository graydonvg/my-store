import { UpdateAddressSchema } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData } from '@/lib/redux/features/addressForm/addressFormSlice';
import { updateUserAddress } from '@/services/users/update';
import AddressForm from './AddressForm';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';
import useForm from '@/hooks/use-form';

export default function UpdateAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector(selectAddressFromData);
  const form = useForm(UpdateAddressSchema, addressFormData);

  async function handleUpdateAddress() {
    dispatch(setIsDialogLoading(true));

    const { success, message } = await updateUserAddress(form.values);

    if (success) {
      router.refresh();
      dispatch(closeDialog());
      dispatch(clearAddressFormData());
      form.reset();
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setIsDialogLoading(false));
  }

  return (
    <AddressForm
      headerText="Add address"
      formValues={form.values}
      formErrors={form.errors}
      onChange={form.handleChange}
      onSubmit={form.handleSubmit(handleUpdateAddress)}
    />
  );
}
