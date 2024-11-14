import { selectIsCartOpen } from '@/lib/redux/features/cart/cartSelectors';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import { setIsNavDrawerOpen } from '@/lib/redux/features/navDrawer/navDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Menu } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export default function NavDrawerButton() {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(selectIsCartOpen);

  function openNavDrawer() {
    dispatch(setIsNavDrawerOpen(true));
    if (isCartOpen) {
      dispatch(setIsCartOpen(false));
    }
  }

  return (
    <IconButton
      edge="start"
      sx={{
        color: (theme) => theme.palette.custom.navbar.upper.text,
      }}
      aria-label="open drawer"
      onClick={openNavDrawer}>
      <Menu />
    </IconButton>
  );
}
