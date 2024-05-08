import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';
import { Person } from '@mui/icons-material';

export default function UpdateFirstNameForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const [firstName, setFirstName] = useState(userData?.firstName ?? '');
  const isUpdatingAccount = useAppSelector((state) => state.account.isUpdatingAccount);

  function cancelUpdateField() {
    dispatch(setFieldToEdit(null));
    setFirstName(userData?.firstName ?? '');
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setFirstName(value);
  }

  async function handleUpdateFirstName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isFirstNameChanged = firstName !== userData?.firstName;

    if (!isFirstNameChanged) {
      dispatch(setFieldToEdit(null));
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      firstName: firstName,
    });

    if (success === true) {
      router.refresh();
      toast.success('Name updated');
    } else {
      toast.error(message);
    }
  }

  return (
    <AccountPageForm
      onSubmit={handleUpdateFirstName}
      disableSubmit={firstName.length === 0 || isUpdatingAccount}
      isSubmitting={isUpdatingAccount}
      onCancel={cancelUpdateField}>
      <CustomTextField
        fullWidth={true}
        label="Name"
        name="firstName"
        type="text"
        value={firstName}
        onChange={handleInputChange}
        hasValue={firstName.length > 0}
        icon={<Person />}
      />
    </AccountPageForm>
  );
}
