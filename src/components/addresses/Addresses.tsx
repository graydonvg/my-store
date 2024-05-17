import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import { BORDER_RADIUS } from '@/data';
import AddressData from './AddressData';
import AddAddressDialog from '../dialogs/addressDialog/AddAddressDialog';

export default function Addresses() {
  const addresses = useAppSelector((state) => state.addresses.data);

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <AddAddressDialog />
      </Box>
    </Box>
  );
}
