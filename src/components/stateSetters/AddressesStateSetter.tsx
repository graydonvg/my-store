'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import { Address } from '@/types';
import { setAddresses } from '@/lib/redux/slices/addressesSlice';

type Props = {
  addresses: Address[] | null;
};

export default function AddressesStateSetter({ addresses }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addresses) {
      dispatch(setAddresses(addresses));
    }
  }, [addresses, dispatch]);

  return null;
}
