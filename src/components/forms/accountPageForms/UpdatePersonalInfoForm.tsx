import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import { toast } from 'react-toastify';
import AccountPageForm from './AccountPageForm';

type Props = {
  field: 'firstName' | 'lastName' | 'contactNumber';
  label: string;
  data: string;
  icon: ReactNode;
};

export default function UpdatePersonalInfoForm({ field, label, data, icon }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(data);
  const isUpdatingAccount = useAppSelector((state) => state.account.isUpdatingAccount);

  function cancelUpdateField() {
    dispatch(setFieldToEdit(null));

    setFormData(data);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setFormData(value);
  }

  async function handleUpdateUserPersonalInfo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isDataChanged = formData !== data;

    if (!isDataChanged) {
      dispatch(setFieldToEdit(null));
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      [field]: formData,
    });

    if (success === true) {
      router.refresh();
      dispatch(setFieldToEdit(null));
      toast.success(`${label} updated`);
    } else {
      toast.error(message);
    }

    dispatch(setIsUpdatingAccount(false));
  }

  return (
    <AccountPageForm
      onSubmit={handleUpdateUserPersonalInfo}
      onCancel={cancelUpdateField}
      isSubmitting={isUpdatingAccount}
      disableSubmit={formData.length === 0 || isUpdatingAccount}>
      <CustomTextField
        fullWidth={true}
        label={label}
        name={field}
        type="text"
        value={formData}
        onChange={handleInputChange}
        hasValue={formData.length > 0}
        icon={icon}
      />
    </AccountPageForm>
  );
}
