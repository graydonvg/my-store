import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { updateUserPassword } from '@/services/users/update';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';

const initialFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function UpdatePasswordForm() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const isUpdatingAccount = useAppSelector((state) => state.account.isUpdatingAccount);

  function handleCancelUpdateField() {
    dispatch(setFieldToEdit(null));
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleUpdatePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (success === true) {
      dispatch(setFieldToEdit(null));
      setFormData(initialFormData);
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setIsUpdatingAccount(false));
  }

  return (
    <AccountPageForm
      onSubmit={handleUpdatePassword}
      disableSubmit={
        formData.currentPassword.length === 0 ||
        formData.newPassword.length === 0 ||
        formData.confirmPassword.length === 0 ||
        isUpdatingAccount
      }
      isSubmitting={isUpdatingAccount}
      onCancel={handleCancelUpdateField}>
      <CustomTextField
        fullWidth={true}
        label={'Current Password'}
        name={'currentPassword'}
        type={'password'}
        value={formData.currentPassword}
        onChange={handleInputChange}
      />
      <CustomTextField
        fullWidth={true}
        label={'New Password'}
        name={'newPassword'}
        type={'password'}
        value={formData.newPassword}
        onChange={handleInputChange}
      />
      <CustomTextField
        fullWidth={true}
        label={'Confirm Password'}
        name={'confirmPassword'}
        type={'password'}
        value={formData.confirmPassword}
        onChange={handleInputChange}
      />
    </AccountPageForm>
  );
}
