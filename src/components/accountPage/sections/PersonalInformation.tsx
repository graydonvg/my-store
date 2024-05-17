import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import UserDataAccountPage from '../UserDataAccountPage';
import { setFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { UserAccountFieldToEdit } from '@/types';
import UpdatePersonalInfoForm from '@/components/forms/accountPageForms/UpdatePersonalInfoForm';
import { Call, Person } from '@mui/icons-material';

export default function PersonalInformation() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  function selectFieldToEdit(field: UserAccountFieldToEdit) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <>
      {fieldToEdit !== 'firstName' ? (
        <UserDataAccountPage
          label="Name"
          onClick={() => selectFieldToEdit('firstName')}>
          {userData?.firstName ?? ''}
        </UserDataAccountPage>
      ) : (
        <UpdatePersonalInfoForm
          field="firstName"
          label="Name"
          data={userData?.firstName ?? ''}
          icon={<Person />}
        />
      )}

      {fieldToEdit !== 'lastName' ? (
        <UserDataAccountPage
          label="Surname"
          onClick={() => selectFieldToEdit('lastName')}>
          {userData?.lastName ?? ''}
        </UserDataAccountPage>
      ) : (
        <UpdatePersonalInfoForm
          field="lastName"
          label="Surname"
          data={userData?.lastName ?? ''}
          icon={<Person />}
        />
      )}

      {fieldToEdit !== 'contactNumber' ? (
        <UserDataAccountPage
          label="Contact number"
          onClick={() => selectFieldToEdit('contactNumber')}>
          {userData?.contactNumber ?? ''}
        </UserDataAccountPage>
      ) : (
        <UpdatePersonalInfoForm
          field="contactNumber"
          label="Contact number"
          data={userData?.contactNumber ?? ''}
          icon={<Call />}
        />
      )}
    </>
  );
}
