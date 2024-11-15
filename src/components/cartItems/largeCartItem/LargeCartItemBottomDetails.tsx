import { selectOrderTotal } from '@/lib/redux/features/cart/cartSelectors';
import { useAppSelector } from '@/lib/redux/hooks';
import { Divider, Typography } from '@mui/material';

const FREE_DELIVERY_THRESHOLD = 500;

type Props = {
  returnInfo: string;
};

export default function LargeCartItemBottomDetails({ returnInfo }: Props) {
  const orderTotal = useAppSelector(selectOrderTotal);

  return (
    <Typography
      lineHeight={1.6}
      component="p"
      fontSize={{ xs: 14, sm: 16 }}
      sx={{ color: (theme) => theme.palette.text.secondary }}>
      {orderTotal > FREE_DELIVERY_THRESHOLD ? (
        <>
          Delivery Free
          <Divider
            component="span"
            variant="fullWidth"
            orientation="vertical"
            sx={{ marginX: 1 }}
          />
        </>
      ) : null}
      {returnInfo}
    </Typography>
  );
}
