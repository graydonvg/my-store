import NoRecentPayments from '@/components/checkoutFlow/payment/NoRecentPayments';
import PaymentSuccessful from '@/components/checkoutFlow/payment/PaymentSuccessful';
import clearCart from '@/lib/db/actions/clearCart';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PaymentPage({ searchParams }: Props) {
  const paymentStatus = (searchParams['payment_status'] as string) ?? '';
  const orderId = (searchParams['order_id'] as string) ?? '';

  if (paymentStatus === 'success' && orderId.length > 0) {
    const response = await clearCart();

    return <PaymentSuccessful clearCartResponse={response} />;
  }

  return <NoRecentPayments />;
}
