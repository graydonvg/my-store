import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { updateUserPassword } from '@/services/users/update';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import AccountPageForm from './AccountPageForm';
import { Lock } from '@mui/icons-material';
import { selectIsUpdatingAccount } from '@/lib/redux/features/account/accountSelectors';
import { CONSTANTS } from '@/constants';
import { UpdatePasswordSchema } from '@/types';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { useLogger } from 'next-axiom';

const initialFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function UpdatePasswordForm() {
  const log = useLogger();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(initialFormData);
  const isUpdatingAccount = useAppSelector(selectIsUpdatingAccount);
  const userData = useAppSelector(selectUserData);

  function cancelUpdate() {
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
      toast.error('New password and confirmation password do not match');
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    const validation = UpdatePasswordSchema.safeParse(passwordData);

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        userId: userData?.userId,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPassword(passwordData);

    if (success) {
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
      onCancel={cancelUpdate}>
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
