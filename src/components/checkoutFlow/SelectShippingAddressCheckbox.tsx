import { Checkbox, TableCell } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { AddressType } from '@/types';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';

type Props = {
  address: AddressType;
};

export default function SelectShippingAddressCheckbox({ address }: Props) {
  const dispatch = useAppDispatch();
  const selectedAddressId = useAppSelector((state) => state.checkout.selectedAddressId);

  function selectShippingAddress() {
    const { addressId, userId, createdAt, ...shippingDetails } = address;

    if (selectedAddressId === addressId) {
      dispatch(setCheckoutData({ selectedAddressId: null, shippingDetails: null }));
    } else {
      dispatch(
        setCheckoutData({
          selectedAddressId: addressId,
          shippingDetails: shippingDetails,
        })
      );
    }
  }

  return (
    <TableCell
      sx={{ display: 'flex', borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`, paddingRight: 0 }}>
      <Checkbox
        checked={selectedAddressId === address.addressId}
        onChange={selectShippingAddress}
        disableRipple
        sx={{ padding: 0 }}
      />
    </TableCell>
  );
}
