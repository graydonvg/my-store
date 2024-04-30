import { Box, TableCell, TableRow } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import AddressButtons from './AddressButtons';
import SelectShippingAddressCheckbox from './SelectShippingAddressCheckbox';
import Address from './Address';
import Recipient from './Recipient';

export default function AddressData() {
  const userData = useAppSelector((state) => state.user.data);
  const pathname = usePathname();
  const isShippingView = pathname.includes('/checkout/shipping');

  return (
    <>
      {userData?.addresses?.map((address, index) => (
        <TableRow
          key={index}
          sx={{
            display: 'flex',
            '&:last-child td': { border: 0 },
          }}>
          {isShippingView ? <SelectShippingAddressCheckbox address={address} /> : null}
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
