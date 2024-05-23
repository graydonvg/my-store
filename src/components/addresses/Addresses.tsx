import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import { constants } from '@/constants';
import AddressData from './AddressData';
import AddAddressDialogButton from './buttons/AddAddressDialogButton';
import AddAddressDialog from '../dialogs/AddAddressDialog';
import { selectAddresses } from '@/lib/redux/features/addresses/addressesSelectors';

export default function Addresses() {
  const addresses = useAppSelector(selectAddresses);

  return (
    <>
      <TableContainer
        sx={{
          marginBottom: 2,
          border: (theme) => `1px solid ${theme.palette.custom.border}`,
          borderRadius: constants.borderRadius,
        }}>
        <Table>
          <TableBody>
            {!addresses || addresses?.length === 0 ? (
              <TableRow>
                <TableCell sx={{ padding: 2, borderBottom: 0 }}>
                  <Typography fontSize={16}>No address found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <AddressData />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: 2 }}>
        <AddAddressDialogButton />
        <AddAddressDialog />
      </Box>
    </>
  );
}
