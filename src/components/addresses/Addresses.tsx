import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearAddressFormData } from '@/lib/redux/slices/addressFormSlice';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { BORDER_RADIUS } from '@/config';
import { useEffect } from 'react';
import AddressData from './AddressData';
import { setAddressToDeleteId } from '@/lib/redux/slices/accountSlice';
import AddNewAddressDialog from '../dialogs/addressDialog/AddNewAddressDialog';

export default function Addresses() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(closeDialog());
    dispatch(setIsDialogLoading(false));
    dispatch(clearAddressFormData());
    dispatch(setAddressToDeleteId(null));
  }, [dispatch, userData?.addresses]);

  return (
    <Box>
      <TableContainer
        sx={{
          marginBottom: 2,
          border: (theme) => `1px solid ${theme.palette.custom.border}`,
          borderRadius: BORDER_RADIUS,
        }}>
        <Table>
          <TableBody>
            <TableRow>
              {userData && userData?.addresses.length === 0 ? (
                <TableCell sx={{ padding: 2, borderBottom: 0 }}>
                  <Typography fontSize={16}>No address found</Typography>
                </TableCell>
              ) : (
                <AddressData />
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <AddNewAddressDialog />
      </Box>
    </Box>
  );
}
