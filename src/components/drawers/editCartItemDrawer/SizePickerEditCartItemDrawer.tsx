import { Box, Divider, List, ListItemButton, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { CartItemType } from '@/types';

type Props = {
  cartItem: CartItemType;
  isUpdatingCartItem: boolean;
  setCartItemSizeOnClick: (size: string) => Promise<void>;
};

export default function SizePickerEditCartItemDrawer({ cartItem, isUpdatingCartItem, setCartItemSizeOnClick }: Props) {
  return (
    <Box>
      <Box sx={{ padding: 2, paddingBottom: 1, opacity: isUpdatingCartItem ? 0.5 : 1 }}>
        <Typography
          fontWeight={600}
          fontSize={24}>
          Select a size
        </Typography>
      </Box>
      <Divider />
      <List
        disablePadding
        sx={{ opacity: isUpdatingCartItem ? 0.5 : 1 }}>
        {cartItem?.product?.sizes.map((size) => (
          <Box key={size}>
            <ListItemButton
              onClick={() => setCartItemSizeOnClick(size)}
              sx={{ height: '56px' }}>
              {size === cartItem.size ? <Check sx={{ marginRight: 1 }} /> : null}
              <Typography>{size}</Typography>
            </ListItemButton>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
