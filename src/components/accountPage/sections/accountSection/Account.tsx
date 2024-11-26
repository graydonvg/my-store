import { useAppSelector } from '@/lib/redux/hooks';
import DisplayUserDataAccountPage from '../../DisplayUserDataAccountPage';
import UpdatePasswordFormFields from '@/components/forms/accountPageForms/UpdatePasswordFormFields';
import PasswordMask from './PasswordMask';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { selectAccountFieldToEdit } from '@/lib/redux/features/account/accountSelectors';

export default function AccountSection() {
  const userData = useAppSelector(selectUserData);
  const accountFieldToEdit = useAppSelector(selectAccountFieldToEdit);
  const isOAuthSignIn = userData?.isOAuthSignIn;

  return (
    <>
      <DisplayUserDataAccountPage
        label="Email"
        canEdit={false}>
        {userData?.email ?? ''}
      </DisplayUserDataAccountPage>

      {!isOAuthSignIn && (accountFieldToEdit !== 'password' ? <PasswordMask /> : <UpdatePasswordFormFields />)}
    </>
  );
}
