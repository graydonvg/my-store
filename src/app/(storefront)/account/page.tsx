import AccountPageClient from '@/components/accountPage/AccountPageClient';
import fetchAddresses from '@/lib/db/queries/fetchAddresses';

export default async function AccountPage() {
  const addresses = await fetchAddresses();

  return <AccountPageClient addresses={addresses} />;
}
