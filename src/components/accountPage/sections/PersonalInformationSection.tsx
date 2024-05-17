import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import DisplayUserDataAccountPage from '../DisplayUserDataAccountPage';
import { setFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { UserAccountFieldToEdit } from '@/types';
import UpdatePersonalInfoForm from '@/components/forms/accountPageForms/UpdatePersonalInfoForm';
import { Call, Person } from '@mui/icons-material';

export default function PersonalInformationSection() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  function selectFieldToEdit(field: UserAccountFieldToEdit) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <>
      {fieldToEdit !== 'firstName' ? (
        <DisplayUserDataAccountPage
          label="Name"
          onClick={() => selectFieldToEdit('firstName')}>
          {userData?.firstName ?? ''}
        </DisplayUserDataAccountPage>
      ) : (
        <UpdatePersonalInfoForm
          field="firstName"
          label="Name"
          data={userData?.firstName ?? ''}
          icon={<Person />}
        />
      )}

      {fieldToEdit !== 'lastName' ? (
        <DisplayUserDataAccountPage
          label="Surname"
          onClick={() => selectFieldToEdit('lastName')}>
          {userData?.lastName ?? ''}
        </DisplayUserDataAccountPage>
      ) : (
        <UpdatePersonalInfoForm
          field="lastName"
          label="Surname"
          data={userData?.lastName ?? ''}
          icon={<Person />}
        />
      )}

      {fieldToEdit !== 'contactNumber' ? (
        <DisplayUserDataAccountPage
          label="Contact number"
          onClick={() => selectFieldToEdit('contactNumber')}>
          {userData?.contactNumber ?? ''}
        </DisplayUserDataAccountPage>
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
