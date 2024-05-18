import CartPageClient from '@/components/checkoutFlow/cart/CartPageClient';
import deleteOrder from '@/lib/db/actions/deleteOrder';
import getCartAndWishlistData from '@/lib/db/queries/getCartAndWishlistData';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Cancelled payments get redirected here

export default async function CartPage({ searchParams }: Props) {
  const { cartItems, wishlistData } = await getCartAndWishlistData();
  const paymentStatus = (searchParams['payment_status'] as string) ?? '';
  const orderId = (searchParams['order_id'] as string) ?? '';

  let deleteCancelledOrderResponse = { success: true, message: '' };

  if (paymentStatus === 'cancelled' || orderId.length > 0) {
    deleteCancelledOrderResponse = await deleteOrder(orderId);
  }

  return (
    <CartPageClient
      cartItems={cartItems}
      wishlistData={wishlistData}
      clearCheckoutData={paymentStatus === 'cancelled'}
      deleteCancelledOrderResponse={deleteCancelledOrderResponse}
    />
  );
}
