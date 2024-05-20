import { OrderItem } from '@/types';
import { roundAndFormatCurrency } from '@/utils/formatCurrency';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  orderItem: OrderItem;
};

export default function OrderItemDetails({ orderItem }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Link href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.productId}`}>
        <Typography fontSize={18}>{orderItem.product?.name}</Typography>
      </Link>
      <Box>
        {[
          { label: 'qty', value: orderItem?.quantity },
          { label: 'size', value: orderItem?.size },
          { label: 'price paid', value: roundAndFormatCurrency(orderItem?.pricePaid) },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              fontSize={13}
              textTransform="uppercase"
              fontWeight={500}
              color={(theme) => theme.palette.text.secondary}>
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
        color={(theme) => theme.palette.text.secondary}>
        {orderItem.product?.returnInfo}
      </Typography>
    </Box>
  );
}
