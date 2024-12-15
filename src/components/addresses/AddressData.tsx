import { Box, TableCell, TableRow } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import AddressButtons from './buttons/AddressButtons';
import Address from './Address';
import Recipient from './Recipient';
import SelectShippingAddressCheckbox from '../checkoutFlow/shipping/SelectShippingAddressCheckbox';
import { selectAddresses } from '@/lib/redux/features/addresses/addressesSelectors';
import { selectOrderAddressId } from '@/lib/redux/features/checkout/checkoutSelectors';
import { AddressType } from '@/types';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';

export default function AddressData() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddresses);
  const orderAddressId = useAppSelector(selectOrderAddressId);
  const isShippingPath = pathname.startsWith('/checkout/shipping');

  function selectShippingAddress(address: AddressType) {
    const { addressId, userId, createdAt, ...shippingDetails } = address;

    if (orderAddressId === addressId) {
      dispatch(setCheckoutData({ orderAddressId: null, orderShippingDetails: null }));
    } else {
      dispatch(
        setCheckoutData({
          orderAddressId: addressId,
          orderShippingDetails: shippingDetails,
        })
      );
    }
  }

  return (
    <>
      {addresses?.map((address) => (
        <TableRow
          key={address.addressId}
          sx={{
            display: 'flex',
            '&:last-child td': { border: 0 },
          }}>
          {isShippingPath ? (
            <SelectShippingAddressCheckbox
              address={address}
              onChange={() => selectShippingAddress(address)}
            />
          ) : null}
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
            <Box
              onClick={() => selectShippingAddress(address)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, cursor: isShippingPath ? 'pointer' : 'default' }}>
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
