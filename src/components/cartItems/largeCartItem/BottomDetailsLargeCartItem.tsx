import { FREE_DELIVERY_THRESHOLD } from '@/config';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectOrderTotal } from '@/lib/redux/selectors/cartSelectors';
import { Divider, Typography } from '@mui/material';

type Props = {
  returnInfo: string;
};

export default function BottomDetailsLargeCartItem({ returnInfo }: Props) {
  const { cartItems } = useAppSelector((state) => state.cart);
  const orderTotal = selectOrderTotal(cartItems);

  return (
    <Typography
      lineHeight={1.6}
      component="p"
      fontSize={{ xs: 14, sm: 16 }}
      color={(theme) => theme.palette.text.secondary}>
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
