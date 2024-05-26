import OutlinedButton from '@/components/ui/buttons/simple/OutlinedButton';
import updateOrderStatus from '@/services/orders/update';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  orderId: number;
};

export default function CancelOrderButton({ orderId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function cancelOrder() {
    setIsLoading(true);

    const { success, message } = await updateOrderStatus({ orderId, orderStatus: 'cancelled' });

    if (!success) {
      toast.error(message);
    } else {
      router.refresh();
      toast.success('Your order has been cancelled');
    }

    setIsLoading(false);
  }

  return (
    <OutlinedButton
      label={!isLoading ? 'cancel' : ''}
      onClick={cancelOrder}
      isLoading={isLoading}
      sxStyles={{ minWidth: 'fit-content', flex: 1 }}
    />
  );
}
