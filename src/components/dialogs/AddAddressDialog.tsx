'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import AddNewAddressForm from '../forms/addressForm/AddNewAddressForm';
import DialogComponent from '../ui/DialogComponent';

export default function AddAddressDialog() {
  const isAddAddressDialogOpen = useAppSelector((state) => state.dialog.addAddressDialog);

  return (
    <DialogComponent isOpen={isAddAddressDialogOpen}>
      <AddNewAddressForm />
    </DialogComponent>
  );
}
