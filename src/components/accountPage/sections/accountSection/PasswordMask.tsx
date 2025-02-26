import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { Typography } from '@mui/material';
import DisplayUserDataAccountPage from '../../DisplayUserDataAccountPage';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';

export default function PasswordMask() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const isAdminDemo = userData?.role === 'admin' && userData.email.includes('admin');

  function selectFieldToEdit(field: string) {
    dispatch(setAccountFieldToEdit(field));
  }

  return (
    <DisplayUserDataAccountPage
      label="Password"
      canEdit={true}
      onClick={() => selectFieldToEdit('password')}>
      {isAdminDemo && (
        <Typography sx={{ color: (theme) => theme.palette.custom.textField.label, fontSize: 12 }}>
          Your admin demo password: 123456
        </Typography>
      )}
      <Typography
        component="div"
        fontSize={3.3}
        sx={{ paddingTop: 1 }}>
        {Array.from(Array(16)).map((_, index) => (
          <Typography
            key={index}
            component="span"
            letterSpacing={1}
            sx={{ color: (theme) => theme.palette.text.primary }}>
            •
          </Typography>
        ))}
      </Typography>
    </DisplayUserDataAccountPage>
  );
}
