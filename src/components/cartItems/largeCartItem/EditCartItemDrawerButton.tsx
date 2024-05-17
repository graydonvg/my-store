import { setCartItemToEditId } from '@/lib/redux/features/editCartItemDrawer/editCartItemDrawerSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { CartItem } from '@/types';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type Props = {
  cartItem: CartItem;
};

export default function EditCartItemDrawerButton({ cartItem }: Props) {
  const dispatch = useAppDispatch();

  function openDrawer() {
    dispatch(setCartItemToEditId(cartItem.cartItemId));
  }

  return (
    <IconButton onClick={openDrawer}>
      <Edit
        fontSize="small"
        sx={{ color: (theme) => theme.palette.text.secondary }}
      />
    </IconButton>
  );
}
