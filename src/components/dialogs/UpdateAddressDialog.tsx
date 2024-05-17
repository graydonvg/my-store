'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import UpdateAddressForm from '../forms/addressForm/UpdateAddressForm';
import DialogComponent from '../ui/DialogComponent';

export default function UpdateAddressDialog() {
  const isUpdateAddressDialogOpen = useAppSelector((state) => state.dialog.updateAddressDialog);

  return (
    <DialogComponent isOpen={isUpdateAddressDialogOpen}>
      <UpdateAddressForm />
    </DialogComponent>
  );
}
