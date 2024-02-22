import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import UserDataAccountPage from '../UserDataAccountPage';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { useEffect } from 'react';
import UpdateFirstNameForm from '@/components/forms/accountPageForms/UpdateFirstNameForm';
import UpdateLastNameForm from '@/components/forms/accountPageForms/UpdateLastNameForm';
import UpdateContactNumberForm from '@/components/forms/accountPageForms/UpdateContactNumberForm';

const fieldInfoMap = {
  firstName: {
    label: 'Name',
    form: <UpdateFirstNameForm />,
  },
  lastName: {
    label: 'Surname',
    form: <UpdateLastNameForm />,
  },
  contactNumber: {
    label: 'Contact number',
    form: <UpdateContactNumberForm />,
  },
};

export default function PersonalInformation() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(setFieldToEdit(null));
    dispatch(setIsUpdatingAccount(false));
  }, [dispatch, userData]);

  function handleSetFieldToEdit(field: string) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <>
      {Object.entries(fieldInfoMap).map(([fieldName, fieldInfo]) => (
        <>
          {fieldToEdit !== fieldName ? (
            <UserDataAccountPage
              label={fieldInfo.label}
              onClick={() => handleSetFieldToEdit(fieldName)}>
              {userData?.[fieldName as keyof typeof fieldInfoMap] ?? ''}
            </UserDataAccountPage>
          ) : null}

          {fieldToEdit === fieldName ? fieldInfo.form : null}
        </>
      ))}
    </>
  );
}
