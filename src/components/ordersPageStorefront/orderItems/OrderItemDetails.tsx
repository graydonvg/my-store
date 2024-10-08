import { OrderItem } from '@/types';
import { formatCurrency } from '@/utils/formatting';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  orderItem: OrderItem;
};

export default function OrderItemDetails({ orderItem }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Link
        href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.name
          .toLowerCase()
          .split(' ')
          .join('-')}/${orderItem.product?.productId}`}>
        <Typography fontSize={18}>{orderItem.product?.name}</Typography>
      </Link>
      <Box>
        {[
          { label: 'qty', value: orderItem?.quantity },
          { label: 'size', value: orderItem?.size },
          { label: 'price paid', value: formatCurrency(orderItem?.pricePaid) },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              fontSize={13}
              textTransform="uppercase"
              fontWeight={500}
              sx={{ color: (theme) => theme.palette.text.secondary }}>
              {item.label}:
            </Typography>
            <Typography
              fontSize={13}
              fontWeight={600}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        fontSize={13}
        textTransform="uppercase"
        sx={{ color: (theme) => theme.palette.text.secondary }}>
        {orderItem.product?.returnInfo}
      </Typography>
    </Box>
  );
}
