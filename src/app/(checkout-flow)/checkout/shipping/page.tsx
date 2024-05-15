import ShippingPageClient from '@/components/checkoutFlow/ShippingPageClient';
import AddressesStateSetter from '@/components/stateSetters/AddressesStateSetter';
import getAddresses from '@/lib/db/queries/getAddresses';

export default async function ShippingPage() {
  const { addresses } = await getAddresses();

  return (
    <>
      <ShippingPageClient />
      <AddressesStateSetter addresses={addresses} />
    </>
  );
}
