import ShippingPageClient from '@/components/checkoutFlow/ShippingPageClient';
import fetchAddresses from '@/lib/db/queries/fetchAddresses';

export default async function ShippingPage() {
  const { addresses } = await fetchAddresses();

  return <ShippingPageClient addresses={addresses} />;
}
