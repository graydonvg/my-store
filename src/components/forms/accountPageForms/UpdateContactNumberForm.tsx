import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';
import { Call } from '@mui/icons-material';

export default function UpdateContactNumberForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const [contactNumber, setContactNumber] = useState(userData?.contactNumber ?? '');
  const isUpdatingAccount = useAppSelector((state) => state.account.isUpdatingAccount);

  function cancelUpdateField() {
    dispatch(setFieldToEdit(null));
    setContactNumber(userData?.contactNumber ?? '');
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setContactNumber(value);
  }

  async function handleUpdateContactNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isContactNumberChanged = contactNumber !== userData?.contactNumber;

    if (!isContactNumberChanged) {
      dispatch(setFieldToEdit(null));
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      contactNumber: contactNumber,
    });

    if (success === true) {
      router.refresh();
      toast.success('Contact number updated');
    } else {
      toast.error(message);
    }
  }

  return (
    <AccountPageForm
      onSubmit={handleUpdateContactNumber}
      disableSubmit={contactNumber.length === 0 || isUpdatingAccount}
      isSubmitting={isUpdatingAccount}
      onCancel={cancelUpdateField}>
      <CustomTextField
        fullWidth={true}
        label={'Contact number'}
        name={'contactNumber'}
        type={'text'}
        value={contactNumber}
        onChange={handleInputChange}
        hasValue={contactNumber.length > 0}
        icon={<Call />}
      />
    </AccountPageForm>
  );
}
