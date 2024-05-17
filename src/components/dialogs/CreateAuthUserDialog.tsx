'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import CreateAuthUserFormAdminPanel from '../forms/CreateAuthUserFormAdminPanel';
import DialogComponent from '../ui/DialogComponent';

export default function CreateAuthUserDialog() {
  const isAddUserDialogOpen = useAppSelector((state) => state.dialog.addUserDialog);

  return (
    <DialogComponent isOpen={isAddUserDialogOpen}>
      <CreateAuthUserFormAdminPanel />
    </DialogComponent>
  );
}
