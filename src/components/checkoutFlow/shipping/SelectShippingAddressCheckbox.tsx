import { Checkbox, TableCell } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { AddressType } from '@/types';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import { selectOrderAddressId } from '@/lib/redux/features/checkout/checkoutSelectors';

type Props = {
  address: AddressType;
};

export default function SelectShippingAddressCheckbox({ address }: Props) {
  const dispatch = useAppDispatch();
  const orderAddressId = useAppSelector(selectOrderAddressId);

  function selectShippingAddress() {
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
    <TableCell
      sx={{ display: 'flex', borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`, paddingRight: 0 }}>
      <Checkbox
        checked={orderAddressId === address.addressId}
        onChange={selectShippingAddress}
        disableRipple
        sx={{ padding: 0 }}
      />
    </TableCell>
  );
}
