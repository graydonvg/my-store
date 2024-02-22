import UserDataAccountPage from '../../UserDataAccountPage';
import { useAppSelector } from '@/lib/redux/hooks';
import PasswordMask from './PasswordMask';
import UpdatePasswordForm from '../../../forms/accountPageForms/UpdatePasswordForm';

export default function Account() {
  const { isOAuthSignIn, userData } = useAppSelector((state) => state.user);
  const { fieldToEdit } = useAppSelector((state) => state.account);

  return (
    <>
      <UserDataAccountPage label="Email">{userData?.email ?? ''}</UserDataAccountPage>

      {!isOAuthSignIn && fieldToEdit !== 'password' ? <PasswordMask /> : null}

      {!isOAuthSignIn && fieldToEdit === 'password' ? <UpdatePasswordForm /> : null}
    </>
  );
}
