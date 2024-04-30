import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import UserDataAccountPage from '../UserDataAccountPage';
import { setFieldToEdit, setIsUpdatingAccount } from '@/lib/redux/slices/accountSlice';
import { Fragment, useEffect } from 'react';
import UpdateFirstNameForm from '@/components/forms/accountPageForms/UpdateFirstNameForm';
import UpdateLastNameForm from '@/components/forms/accountPageForms/UpdateLastNameForm';
import UpdateContactNumberForm from '@/components/forms/accountPageForms/UpdateContactNumberForm';
import { AccountFieldToEditType } from '@/types';

const fieldDataMap = {
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
  const userData = useAppSelector((state) => state.user.data);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(setFieldToEdit(null));
    dispatch(setIsUpdatingAccount(false));
  }, [dispatch, userData]);

  function selectFieldToEdit(field: AccountFieldToEditType) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <>
      {Object.entries(fieldDataMap).map(([fieldName, fieldData]) => (
        <Fragment key={fieldName}>
          {fieldToEdit !== fieldName ? (
            <UserDataAccountPage
              label={fieldData.label}
              onClick={() => selectFieldToEdit(fieldName as keyof typeof fieldDataMap)}>
              {userData?.[fieldName as keyof typeof fieldDataMap] ?? ''}
            </UserDataAccountPage>
          ) : null}

          {fieldToEdit === fieldName ? fieldData.form : null}
        </Fragment>
      ))}
    </>
  );
}
