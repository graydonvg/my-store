import { Box, Divider, List, ListItemButton, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { CartItem } from '@/types';

type Props = {
  cartItem: CartItem;
  isUpdatingCartItem: boolean;
  setCartItemSizeOnClick: (size: string) => Promise<void>;
};

export default function EditCartItemDrawerSizePicker({ cartItem, isUpdatingCartItem, setCartItemSizeOnClick }: Props) {
  return (
    <Box>
      <Box sx={{ padding: 2, opacity: isUpdatingCartItem ? 0.5 : 1, height: '64px' }}>
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
              <Typography
                sx={{
                  color: (theme) =>
                    size === cartItem.size ? theme.palette.text.primary : theme.palette.text.secondary,
                }}>
                {size}
              </Typography>
            </ListItemButton>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
