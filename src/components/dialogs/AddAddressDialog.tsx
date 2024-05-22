'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import AddNewAddressForm from '../forms/addressForm/AddNewAddressForm';
import DialogComponent from '../ui/DialogComponent';
import { selectIsAddAddressDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';

export default function AddAddressDialog() {
  const isAddAddressDialogOpen = useAppSelector(selectIsAddAddressDialogOpen);

  return (
    <DialogComponent isOpen={isAddAddressDialogOpen}>
      <AddNewAddressForm />
    </DialogComponent>
  );
}
