import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { toast } from 'react-toastify';
import BreadcrumbItem from '../breadcrumbs/BreadcrumbItem';
import { Payment } from '@mui/icons-material';
import ContainedButton from './ContainedButton';

type Props = {
  showContainedButton?: boolean;
  showBreadcrumbButton?: boolean;
};

export default function PaymentButton({ showBreadcrumbButton = false, showContainedButton = false }: Props) {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const shippingDetails = useAppSelector((state) => state.checkoutData.shippingDetails);

  async function handlePayWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    const error = await payWithStripe(cartItems);

    if (error?.success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(error.message);
    }
  }

  if (showContainedButton)
    return (
      <ContainedButton
        disabled={!shippingDetails}
        onClick={handlePayWithStripe}
        label={'continue to payment'}
        fullWidth
        backgroundColor={'red'}
      />
    );

  if (showBreadcrumbButton)
    return (
      <BreadcrumbItem
        href=""
        icon={<Payment />}
        label="payment"
        onLinkClick={!!shippingDetails ? handlePayWithStripe : undefined}
      />
    );
}
