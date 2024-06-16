import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import CustomTextField from '@/components/ui/inputFields/CustomTextField';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/features/account/accountSlice';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update';
import { toast } from 'react-toastify';
import AccountPageForm from './AccountPageForm';
import { selectIsUpdatingAccount } from '@/lib/redux/features/account/accountSelectors';
import { UpdateUserDataSchema } from '@/types';
import { constructZodErrorMessage } from '@/utils/construct';
import { useLogger } from 'next-axiom';
import { CONSTANTS } from '@/constants';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

type Props = {
  field: 'firstName' | 'lastName' | 'contactNumber';
  label: string;
  data: string;
  icon: ReactNode;
};

export default function UpdatePersonalInfoForm({ field, label, data, icon }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const log = useLogger();
  const [formData, setFormData] = useState(data);
  const isUpdatingAccount = useAppSelector(selectIsUpdatingAccount);
  const userData = useAppSelector(selectUserData);

  function cancelUpdateField() {
    dispatch(setAccountFieldToEdit(null));

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
      dispatch(setAccountFieldToEdit(null));
      return;
    }

    const validation = UpdateUserDataSchema.safeParse({ [field]: formData });

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        userId: userData?.userId,
        payload: { [field]: formData },
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    dispatch(setIsUpdatingAccount(true));

    const { success, message } = await updateUserPersonalInformation({
      [field]: formData,
    });

    if (success === true) {
      router.refresh();
      dispatch(setAccountFieldToEdit(null));
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
      disableSubmit={formData.length === 0}>
      <CustomTextField
        fullWidth={true}
        label={label}
        name={field}
        type="text"
        value={formData}
        onChange={handleInputChange}
        hasValue={formData.length > 0}
        icon={icon}
        autoFocus
        required
      />
    </AccountPageForm>
  );
}
