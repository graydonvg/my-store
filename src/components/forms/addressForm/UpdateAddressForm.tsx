import { ChangeEvent, FormEvent } from 'react';
import { AddressStore, UpdateAddressSchema } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/features/addressForm/addressFormSlice';
import { updateUserAddress } from '@/services/users/update';
import AddressForm from './AddressForm';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { useLogger } from 'next-axiom';
import { CONSTANTS } from '@/constants';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

export default function UpdateAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const log = useLogger();
  const addressFormData = useAppSelector(selectAddressFromData);
  const userData = useAppSelector(selectUserData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof AddressStore, value }));
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = UpdateAddressSchema.safeParse(addressFormData);

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        userId: userData?.userId,
        payload: addressFormData,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsDialogLoading(true));

    const { success, message } = await updateUserAddress(validation.data);

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
      onInputChange={handleInputChange}
      onSubmit={handleUpdateAddress}
    />
  );
}
