import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { updateUserPassword } from '@/services/users/update';
import { toast } from 'react-toastify';
import CustomTextField from '@/components/ui/CustomTextField';
import AccountPageForm from './AccountPageForm';
import { Lock } from '@mui/icons-material';
import { selectIsUpdatingAccount } from '@/lib/redux/features/account/accountSelectors';
import { UpdatePasswordSchema } from '@/types';
import useForm from '@/hooks/use-form';
import { getEmptyObjectKeys } from '@/utils/objectHelpers';

const fieldConfigs = [
  {
    label: 'Current password',
    id: 'current-password',
    name: 'currentPassword',
    type: 'password',
    autoComplete: 'current-password',
    ariaDescribedBy: 'current-password-helper-text',
  },
  {
    label: 'New password',
    id: 'new-password',
    name: 'newPassword',
    type: 'password',
    autoComplete: 'new-password',
    ariaDescribedBy: 'new-password-helper-text',
  },
  {
    label: 'Confirm password',
    id: 'confirm-password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    ariaDescribedBy: 'confirm-password-helper-text',
  },
];

const initialFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function UpdatePasswordFormFields() {
  const dispatch = useAppDispatch();
  const isUpdatingAccount = useAppSelector(selectIsUpdatingAccount);
  const form = useForm(UpdatePasswordSchema, initialFormData, {
    checkEquality: [{ fields: ['newPassword', 'confirmPassword'], message: 'Passwords do not match' }],
  });
  const emptyFormFields = getEmptyObjectKeys(form.values);

  function cancelUpdate() {
    dispatch(setAccountFieldToEdit(null));
  }

  async function handleUpdatePassword() {
    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPassword(form.values);

    if (success) {
      dispatch(setAccountFieldToEdit(null));
      form.reset();
      toast.success(message);
    } else {
      toast.error(message);
    }

    dispatch(setIsUpdatingAccount(false));
  }

  return (
    <AccountPageForm
      onSubmit={form.handleSubmit(handleUpdatePassword)}
      disableSubmit={emptyFormFields.length > 0}
      isSubmitting={isUpdatingAccount}
      onCancel={cancelUpdate}>
      {fieldConfigs.map((field) => (
        <CustomTextField
          key={field.id}
          id={field.id}
          label={field.label}
          name={field.name}
          type={field.type || 'text'}
          autoComplete={field.autoComplete}
          value={form.values[field.name as keyof typeof form.values]}
          onChange={form.handleChange}
          hasValue={form.values[field.name as keyof typeof form.values].length > 0}
          aria-invalid={!!form.errors[field.name as keyof typeof form.errors]}
          error={!!form.errors[field.name as keyof typeof form.errors]}
          helperText={form.errors[field.name as keyof typeof form.errors]}
          aria-describedby={field.ariaDescribedBy}
          icon={<Lock />}
          autoFocus={field.name === 'currentPassword'}
          fullWidth
          required
        />
      ))}
    </AccountPageForm>
  );
}
