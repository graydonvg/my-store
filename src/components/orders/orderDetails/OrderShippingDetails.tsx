import { ShippingDetailsType } from '@/types';
import { Box, Typography } from '@mui/material';

type Props = {
  shippingDetails: ShippingDetailsType;
};

export default function OrderShippingDetails({ shippingDetails }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Typography
        component="h4"
        fontSize={14}
        fontWeight={500}
        textTransform="uppercase">
        Shipping Details:
      </Typography>
      <Box>
        {[
          { label: 'Full Name', value: `${shippingDetails.recipientFirstName} ${shippingDetails.recipientLastName}` },
          { label: 'Contact Number', value: shippingDetails.recipientContactNumber },
          { label: 'Complex or Building', value: shippingDetails.complexOrBuilding },
          { label: 'Street Address', value: shippingDetails.streetAddress },
          { label: 'Suburb', value: shippingDetails.suburb },
          { label: 'Province', value: shippingDetails.province },
          { label: 'City', value: shippingDetails.city },
          { label: 'Postal Code', value: shippingDetails.postalCode },
        ].map((item) => (
          <Typography
            key={item.label}
            id={item.label}
            component="p"
            fontSize={14}>
            {item.value}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
