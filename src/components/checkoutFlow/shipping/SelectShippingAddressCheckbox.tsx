import { Checkbox, TableCell } from '@mui/material';
import { useAppSelector } from '@/lib/redux/hooks';
import { AddressType } from '@/types';
import { selectOrderAddressId } from '@/lib/redux/features/checkout/checkoutSelectors';

type Props = {
  address: AddressType;
  onChange: () => void;
};

export default function SelectShippingAddressCheckbox({ address, onChange }: Props) {
  const orderAddressId = useAppSelector(selectOrderAddressId);

  return (
    <TableCell
      sx={{ display: 'flex', borderBottom: (theme) => `1px solid ${theme.palette.custom.border}`, paddingRight: 0 }}>
      <Checkbox
        checked={orderAddressId === address.addressId}
        onChange={onChange}
        disableRipple
        sx={{ padding: 0 }}
        inputProps={{
          'aria-label': 'select address checkbox',
        }}
      />
    </TableCell>
  );
}
