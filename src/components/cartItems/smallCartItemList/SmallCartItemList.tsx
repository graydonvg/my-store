import { useAppSelector } from '@/lib/redux/hooks';
import { Box, List, Typography } from '@mui/material';
import { constants } from '@/constants';
import SmallCartItems from './SmallCartItems';
import { selectCartItems } from '@/lib/redux/features/cart/cartSelectors';

type Props = {
  paddingX?: number | string;
};

export default function SmallCartItemList({ paddingX = 0 }: Props) {
  const cartItems = useAppSelector(selectCartItems);

  return (
    <List
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingX: paddingX,
        height: 1,
      }}>
      {cartItems.length === 0 ? (
        <Box
          sx={{
            padding: 1,
            marginTop: 2,
            borderRadius: constants.borderRadius,
            backgroundColor: (theme) => theme.palette.custom.navbar.lower.background,
          }}>
          <Typography
            lineHeight={1}
            component="p"
            fontSize={24}>
            Your cart is empty.
          </Typography>
        </Box>
      ) : null}
      {cartItems.length > 0 ? <SmallCartItems /> : null}
    </List>
  );
}
