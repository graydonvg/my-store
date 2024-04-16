import { useAppDispatch } from '@/lib/redux/hooks';
import { setFieldToEdit } from '@/lib/redux/slices/accountSlice';
import { Typography } from '@mui/material';
import UserDataAccountPage from '../../UserDataAccountPage';
import { AccountFieldToEditType } from '@/types';

export default function PasswordMask() {
  const dispatch = useAppDispatch();

  function selectFieldToEdit(field: AccountFieldToEditType) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <UserDataAccountPage
      label="Password"
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
            sx={{ color: (theme) => theme.palette.custom.typography }}>
            •
          </Typography>
        ))}
      </Typography>
    </UserDataAccountPage>
  );
}
