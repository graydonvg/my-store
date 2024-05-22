'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import UpdateAddressForm from '../forms/addressForm/UpdateAddressForm';
import DialogComponent from '../ui/DialogComponent';
import { selectIsUpdateAddressDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';

export default function UpdateAddressDialog() {
  const isUpdateAddressDialogOpen = useAppSelector(selectIsUpdateAddressDialogOpen);

  return (
    <DialogComponent isOpen={isUpdateAddressDialogOpen}>
      <UpdateAddressForm />
    </DialogComponent>
  );
}
