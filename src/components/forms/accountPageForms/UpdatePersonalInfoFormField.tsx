import { ReactNode } from 'react';
import CustomTextField from '@/components/ui/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import { toast } from 'react-toastify';
import AccountPageForm from './AccountPageForm';
import { selectIsUpdatingAccount } from '@/lib/redux/features/account/accountSelectors';
import useForm from '@/hooks/use-form';
import { ZodObject } from 'zod';

type Props = {
  userData: string;
  fieldConfig: {
    id: string;
    name: string;
    label: string;
    type?: string;
    autoComplete: string;
    ariaDescribedBy: string;
    icon: ReactNode;
    schema: ZodObject<any, any, any>;
  };
};

export default function UpdatePersonalInfoFormField({ userData, fieldConfig }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isUpdatingAccount = useAppSelector(selectIsUpdatingAccount);
  const form = useForm(fieldConfig.schema, { [fieldConfig.name]: userData });

  function cancelUpdateField() {
    dispatch(setAccountFieldToEdit(null));
  }

  async function handleUpdateUserPersonalInfo() {
    const isDataChanged = form.values[fieldConfig.name] !== userData;

    if (!isDataChanged) {
      dispatch(setAccountFieldToEdit(null));
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      [fieldConfig.name]: form.values[fieldConfig.name],
    });

    if (success === true) {
      router.refresh();
      dispatch(setAccountFieldToEdit(null));
      toast.success(`${fieldConfig.label} updated`);
    } else {
      toast.error(message);
    }

    dispatch(setIsUpdatingAccount(false));
  }

  return (
    <AccountPageForm
      onSubmit={form.handleSubmit(handleUpdateUserPersonalInfo)}
      onCancel={cancelUpdateField}
      isSubmitting={isUpdatingAccount}
      disableSubmit={form.values[fieldConfig.name].length === 0}>
      <CustomTextField
        id={fieldConfig.id}
        label={fieldConfig.label}
        name={fieldConfig.name}
        type={fieldConfig.type || 'text'}
        autoComplete={fieldConfig.autoComplete}
        value={form.values[fieldConfig.name]}
        onChange={form.handleChange}
        hasValue={form.values[fieldConfig.name].length > 0}
        icon={fieldConfig.icon}
        aria-invalid={!!form.errors[fieldConfig.name]}
        error={!!form.errors[fieldConfig.name]}
        helperText={form.errors[fieldConfig.name]}
        aria-describedby={fieldConfig.ariaDescribedBy}
        autoFocus
        fullWidth
        required
      />
    </AccountPageForm>
  );
}
