import { Toolbar, useTheme } from '@mui/material';
import DrawerComponent from '../../ui/DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';
import SmallCartItemList from '../../cartItems/smallCartItemList/SmallCartItemList';
import FooterCartDrawer from './FooterCartDrawer';
import { selectCartItems, selectIsCartOpen } from '@/lib/redux/features/cart/cartSelectors';

export default function CartDrawer() {
  const cartItems = useAppSelector(selectCartItems);
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  function closeCartDrawer() {
    dispatch(setIsCartOpen(false));
  }

  return (
    <DrawerComponent
      isOpen={{ right: isCartOpen }}
      closeDrawer={closeCartDrawer}
      drawerProps={{ sx: { zIndex: theme.zIndex.appBar - 1 } }}
      paperProps={{
        sx: {
          width: { xs: '90vw', sm: '400px' },
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
        },
      }}>
      <Toolbar
        sx={{
          minHeight: { xs: '64px !important', md: '96px !important' },
        }}
      />
      <SmallCartItemList paddingX={2} />
      {cartItems.length > 0 ? <FooterCartDrawer /> : null}
    </DrawerComponent>
  );
}
