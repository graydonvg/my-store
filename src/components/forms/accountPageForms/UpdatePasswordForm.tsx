import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { updateUserPassword } from '@/services/users/update';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';
import { Lock } from '@mui/icons-material';
import { selectIsUpdatingAccount } from '@/lib/redux/features/account/accountSelectors';

const initialFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function UpdatePasswordForm() {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const isUpdatingAccount = useAppSelector(selectIsUpdatingAccount);

  function handleCancelUpdateField() {
    dispatch(setAccountFieldToEdit(null));
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
      dispatch(setAccountFieldToEdit(null));
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
        formData.confirmPassword.length === 0
      }
      isSubmitting={isUpdatingAccount}
      onCancel={handleCancelUpdateField}>
      <CustomTextField
        fullWidth={true}
        label="Current Password"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={handleInputChange}
        hasValue={formData.currentPassword.length > 0}
        icon={<Lock />}
        autoFocus
        required
      />
      <CustomTextField
        fullWidth={true}
        label="New Password"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleInputChange}
        hasValue={formData.newPassword.length > 0}
        icon={<Lock />}
        required
      />
      <CustomTextField
        fullWidth={true}
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        hasValue={formData.confirmPassword.length > 0}
        icon={<Lock />}
        required
      />
    </AccountPageForm>
  );
}
