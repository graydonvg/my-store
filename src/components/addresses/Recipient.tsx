import useColorPalette from '@/hooks/useColorPalette';
import { AddressType } from '@/types';
import { Box, Typography } from '@mui/material';

type Props = {
  address: AddressType;
};

export default function Recipient({ address }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography
        color={colorPalette.typographyVariants.grey}
        fontSize={14}
        fontWeight={500}>
        Recipient:
      </Typography>
      <Typography
        color={colorPalette.typographyVariants.grey}
        fontSize={14}>
        {`${address.recipientFirstName} ${address.recipientLastName}, ${address.recipientContactNumber}`}
      </Typography>
    </Box>
  );
}
