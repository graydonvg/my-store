import AccountPageClient from '@/components/accountPage/AccountPageClient';
import { CONSTANTS } from '@/constants';
import fetchAddresses from '@/services/db/queries/fetchAddresses';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${CONSTANTS.STORE_NAME} - Account Info`,
};

export default async function AccountPage() {
  const addresses = await fetchAddresses();

  return <AccountPageClient addresses={addresses} />;
}
