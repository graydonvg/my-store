import { useAppDispatch } from '@/lib/redux/hooks';
import { setAccountFieldToEdit } from '@/lib/redux/features/account/accountSlice';
import { Typography } from '@mui/material';
import DisplayUserDataAccountPage from '../../DisplayUserDataAccountPage';
import { UserAccountFieldToEdit } from '@/types';

export default function PasswordMask() {
  const dispatch = useAppDispatch();

  function selectFieldToEdit(field: UserAccountFieldToEdit) {
    dispatch(setAccountFieldToEdit(field));
  }

  return (
    <DisplayUserDataAccountPage
      label="Password"
      canEdit={true}
      onClick={() => selectFieldToEdit('password')}>
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
