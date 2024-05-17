'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import CreateAuthUserForm from '../forms/CreateAuthUserForm';
import DialogComponent from '../ui/DialogComponent';

export default function CreateAuthUserDialog() {
  const isAddUserDialogOpen = useAppSelector((state) => state.dialog.addUserDialog);

  return (
    <DialogComponent isOpen={isAddUserDialogOpen}>
      <CreateAuthUserForm />
    </DialogComponent>
  );
}
