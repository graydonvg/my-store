import { AddressType } from '@/types';
import { Box, Typography } from '@mui/material';

type Props = {
  address: AddressType;
};

export default function Recipient({ address }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography
        color={(theme) => theme.palette.text.secondary}
        fontSize={14}
        fontWeight={500}>
        Recipient:
      </Typography>
      <Typography
        color={(theme) => theme.palette.text.secondary}
        fontSize={14}>
        {`${address.recipientFirstName} ${address.recipientLastName}, ${address.recipientContactNumber}`}
      </Typography>
    </Box>
  );
}
