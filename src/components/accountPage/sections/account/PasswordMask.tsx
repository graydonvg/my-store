import { useAppDispatch } from '@/lib/redux/hooks';
import { setFieldToEdit } from '@/lib/redux/slices/accountSlice';
import { Box, Typography, useTheme } from '@mui/material';
import UserDataAccountPage from '../../UserDataAccountPage';
import { AccountFieldToEditType } from '@/types';

export default function PasswordMask() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleSetFieldToEdit(field: AccountFieldToEditType) {
    dispatch(setFieldToEdit(field));
  }

  return (
    <UserDataAccountPage
      label="Password"
      onClick={() => handleSetFieldToEdit('password')}>
      <Typography
        component="div"
        fontSize={3.3}
        sx={{ paddingTop: 1 }}>
        {Array.from(Array(16)).map((_, index) => (
          <Box
            component="span"
            key={index}
            sx={{ paddingRight: 0.12 }}>
            {mode === 'dark' ? '⚪' : '⚫'}
          </Box>
        ))}
      </Typography>
    </UserDataAccountPage>
  );
}
