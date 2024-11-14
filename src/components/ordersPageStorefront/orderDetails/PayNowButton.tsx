import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { createNewStripeCheckoutSession, resumeStripeCheckout } from '@/services/stripe/checkout';
import { OrderData } from '@/types';
import { getLineItemsFromDatabaseOrderItems } from '@/utils/stripeHelpers';
import { Payment } from '@mui/icons-material';
import { toast } from 'react-toastify';

type Props = {
  order: OrderData;
  sessionId: string | null;
};

export default function PayNowButton({ order, sessionId }: Props) {
  async function payNow() {
    if (!sessionId) {
      const lineItems = getLineItemsFromDatabaseOrderItems(order.orderItems);

      const { success, message } = await createNewStripeCheckoutSession(order.orderId, lineItems);

      if (!success) {
        toast.error(message);
      }
    } else {
      const { success, message } = await resumeStripeCheckout(sessionId);

      if (!success) {
        toast.error(message);
      }
    }
  }
  return (
    <ContainedButton
      label="pay now"
      onClick={payNow}
      color="secondary"
      sxStyles={{ minWidth: 'fit-content', flex: 1 }}
      startIcon={<Payment />}
    />
  );
}
