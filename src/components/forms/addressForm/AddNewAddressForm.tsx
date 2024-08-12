import { ChangeEvent, FormEvent } from 'react';
import { addNewAddress } from '@/services/users/add';
import { AddressStore, InsertAddressSchema } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/features/addressForm/addressFormSlice';
import AddressForm from './AddressForm';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';
import { constructZodErrorMessage } from '@/utils/construct';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { updateUserPersonalInformation } from '@/services/users/update';

export default function AddNewAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector(selectAddressFromData);
  const userData = useAppSelector(selectUserData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof AddressStore, value }));
  }

  async function handleAddNewAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = InsertAddressSchema.safeParse(addressFormData);

    if (!validation.success) {
      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsDialogLoading(true));

    if (!userData?.firstName || !userData?.lastName || !userData?.contactNumber) {
      const userPersonalInfo = {
        ...(userData?.firstName ? {} : { firstName: validation.data.recipientFirstName }),
        ...(userData?.lastName ? {} : { lastName: validation.data.recipientLastName }),
        ...(userData?.contactNumber ? {} : { contactNumber: validation.data.recipientContactNumber }),
      };

      await updateUserPersonalInformation(userPersonalInfo);
    }

    const { success, message } = await addNewAddress(validation.data);

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
