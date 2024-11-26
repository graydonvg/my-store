import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DisplayUserDataAccountPage from '../DisplayUserDataAccountPage';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { ContactNumberSchema, FirstNameSchema, LastNameSchema } from '@/types';
import UpdatePersonalInfoFormField from '@/components/forms/accountPageForms/UpdatePersonalInfoFormField';
import { Call, Person } from '@mui/icons-material';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { selectAccountFieldToEdit } from '@/lib/redux/features/account/accountSelectors';
import { z } from 'zod';

const fieldConfigs = [
  {
    label: 'First name',
    id: 'first-name',
    name: 'firstName',
    autoComplete: 'given-name',
    icon: <Person />,
    ariaDescribedBy: 'first-name-helper-text',
    schema: FirstNameSchema,
  },
  {
    label: 'Last name',
    id: 'last-name',
    name: 'lastName',
    autoComplete: 'family-name',
    icon: <Person />,
    ariaDescribedBy: 'last-name-helper-text',
    schema: LastNameSchema,
  },
  {
    label: 'Contact number',
    id: 'contact-number',
    name: 'contactNumber',
    type: 'tel',
    autoComplete: 'tel',
    icon: <Call />,
    ariaDescribedBy: 'contact-number-helper-text',
    schema: ContactNumberSchema,
  },
];

export default function PersonalInformationSection() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const accountFieldToEdit = useAppSelector(selectAccountFieldToEdit);

  function selectFieldToEdit(field: string) {
    dispatch(setAccountFieldToEdit(field));
  }

  return (
    <>
      {fieldConfigs.map((field) => {
        return accountFieldToEdit !== field.name ? (
          <DisplayUserDataAccountPage
            key={field.id}
            label={field.label}
            canEdit={true}
            onClick={() => selectFieldToEdit(field.name)}>
            {userData?.[field.name as keyof typeof userData] ?? ''}
          </DisplayUserDataAccountPage>
        ) : (
          <UpdatePersonalInfoFormField
            key={field.id}
            userData={(userData?.[field.name as keyof typeof userData] as string) ?? ''}
            fieldConfig={{ ...field, schema: z.object({ [field.name]: field.schema }) }}
          />
        );
      })}
    </>
  );
}
