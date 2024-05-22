import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from '../simple/ContainedButton';
import { calculateDiscountedCartItemPrice } from '@/utils/calculate';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import {
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectDiscountTotal,
  selectCartItems,
} from '@/lib/redux/features/cart/cartSelectors';
import { ShoppingCartCheckout } from '@mui/icons-material';
import { setIsCartOpen } from '@/lib/redux/features/cart/cartSlice';

type Props = ButtonProps & {
  disabled?: boolean;
  label: string;
  sxStyles?: SxProps<Theme> | undefined;
};

export default function CheckoutButton({ disabled, label, sxStyles, ...props }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const discountTotal = useAppSelector(selectDiscountTotal);
  const deliveryFee = useAppSelector(selectDeliveryFee);
  const orderTotal = useAppSelector(selectOrderTotal);

  function handleCheckoutNow() {
    const orderItems = cartItems.map((item) => {
      const pricePaid =
        item?.product?.isOnSale === 'Yes'
          ? calculateDiscountedCartItemPrice(item.product.price, item.product.salePercentage)
          : item?.product?.price;
      const roundedPrice = Math.round(pricePaid!);

      return {
        productId: item?.product?.productId!,
        quantity: item?.quantity!,
        size: item?.size!,
        pricePaid: roundedPrice,
      };
    });

    dispatch(
      setCheckoutData({
        orderPaymentTotals: { cartTotal, deliveryFee, orderTotal, discountTotal },
        orderItems,
      })
    );

    dispatch(setIsCartOpen(false));

    router.push('/checkout/shipping');
  }

  return (
    <ContainedButton
      color="secondary"
      disabled={disabled}
      onClick={handleCheckoutNow}
      label={label}
      sxStyles={sxStyles}
      startIcon={<ShoppingCartCheckout />}
      {...props}
    />
  );
}
