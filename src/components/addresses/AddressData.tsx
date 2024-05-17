import { Box, TableCell, TableRow } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import AddressButtons from './buttons/AddressButtons';
import Address from './Address';
import Recipient from './Recipient';
import SelectShippingAddressCheckbox from '../checkoutFlow/SelectShippingAddressCheckbox';

export default function AddressData() {
  const addresses = useAppSelector((state) => state.addresses.data);
  const pathname = usePathname();
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  return (
    <>
      {addresses?.map((address, index) => (
        <TableRow
          key={index}
          sx={{
            display: 'flex',
            '&:last-child td': { border: 0 },
          }}>
          {isShippingPath ? <SelectShippingAddressCheckbox address={address} /> : null}
          <TableCell
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              padding: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              rowGap: 2,
              columnGap: 4,
              borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`,
              width: 1,
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Address address={address} />
              <Recipient address={address} />
            </Box>
            <AddressButtons addressId={address.addressId} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
