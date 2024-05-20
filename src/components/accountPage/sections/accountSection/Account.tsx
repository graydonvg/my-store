import { useAppSelector } from '@/lib/redux/hooks';
import DisplayUserDataAccountPage from '../../DisplayUserDataAccountPage';
import UpdatePasswordForm from '@/components/forms/accountPageForms/UpdatePasswordForm';
import PasswordMask from './PasswordMask';

export default function AccountSection() {
  const userData = useAppSelector((state) => state.user.data);
  const { fieldToEdit } = useAppSelector((state) => state.account);
  const isOAuthSignIn = userData?.isOAuthSignIn;

  return (
    <>
      <DisplayUserDataAccountPage
        label="Email"
        canEdit={false}>
        {userData?.email ?? ''}
      </DisplayUserDataAccountPage>

      {!isOAuthSignIn && (fieldToEdit !== 'password' ? <PasswordMask /> : <UpdatePasswordForm />)}
    </>
  );
}
