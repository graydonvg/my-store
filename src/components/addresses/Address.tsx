import { type Address } from '@/types';
import { Typography } from '@mui/material';

type Props = {
  address: Address;
};

export default function Address({ address }: Props) {
  return (
    <Typography fontSize={16}>
      {address.complexOrBuilding ? `${address.complexOrBuilding}, ` : null}

      {`${address.streetAddress}, ${address.suburb}, ${address.province}, ${address.city}, ${address.postalCode}`}
    </Typography>
  );
}
