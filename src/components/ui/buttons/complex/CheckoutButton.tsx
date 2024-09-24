import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { ButtonProps, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import ContainedButton from '../simple/ContainedButton';
import { calculateRoundedDiscountedPrice } from '@/utils/calculations';
import { setCheckoutData } from '@/lib/redux/features/checkout/checkoutSlice';
import {
  selectCartItems,
  selectCartTotal,
  selectDeliveryFee,
  selectOrderTotal,
  selectRoundedDiscountTotal,
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
  const roundedDiscountTotal = useAppSelector(selectRoundedDiscountTotal);
  const deliveryFee = useAppSelector(selectDeliveryFee);
  const orderTotal = useAppSelector(selectOrderTotal);

  function processCheckout() {
    const checkoutItems = cartItems.map((item) => {
      const pricePaid = item.product?.isOnSale
        ? calculateRoundedDiscountedPrice(item.product.price, item.product.salePercentage)
        : item.product?.price!;

      return {
        productId: item.product?.productId!,
        quantity: item.quantity,
        size: item.size,
        pricePaid,
      };
    });

    dispatch(
      setCheckoutData({
        orderPaymentTotals: { cartTotal, deliveryFee, orderTotal, discountTotal: roundedDiscountTotal },
        checkoutItems,
      })
    );

    dispatch(setIsCartOpen(false));

    router.push('/checkout/shipping');
  }

  return (
    <ContainedButton
      color="secondary"
      disabled={disabled}
      onClick={processCheckout}
      label={label}
      sxStyles={sxStyles}
      startIcon={<ShoppingCartCheckout />}
      {...props}
    />
  );
}
