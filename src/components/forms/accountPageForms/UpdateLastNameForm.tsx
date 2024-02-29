import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';

export default function UpdateLastNameForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);
  const [lastName, setLastName] = useState(userData?.lastName ?? '');
  const isUpdatingAccount = useAppSelector((state) => state.account.isUpdatingAccount);

  function handleCancelUpdateField() {
    dispatch(setFieldToEdit(null));
    setLastName(userData?.lastName ?? '');
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setLastName(value);
  }

  async function handleUpdateLastName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isLastNameChanged = lastName !== userData?.lastName;

    if (!isLastNameChanged) {
      dispatch(setFieldToEdit(null));
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      lastName: lastName,
    });

    if (success === true) {
      router.refresh();
      toast.success('Surname updated succssfully');
    } else {
      toast.error(message);
    }
  }

  return (
    <AccountPageForm
      onSubmit={handleUpdateLastName}
      disableSubmit={lastName.length === 0 || isUpdatingAccount}
      isSubmitting={isUpdatingAccount}
      onCancel={handleCancelUpdateField}>
      <CustomTextField
        fullWidth={true}
        label={'Surname'}
        name={'lastName'}
        type={'text'}
        value={lastName}
        onChange={handleInputChange}
      />
    </AccountPageForm>
  );
}
