'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import CreateAuthUserForm from '../forms/CreateAuthUserForm';
import DialogComponent from '../ui/DialogComponent';
import { selectIsAddUserDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';

export default function CreateAuthUserDialog() {
  const isAddUserDialogOpen = useAppSelector(selectIsAddUserDialogOpen);

  return (
    <DialogComponent isOpen={isAddUserDialogOpen}>
      <CreateAuthUserForm />
    </DialogComponent>
  );
}
