'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import CreateAuthUserForm from '../forms/CreateAuthUserForm';
import DialogComponent from '../ui/DialogComponent';
import { selectIsAddUserDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CreateAuthUserDialog({ children }: Props) {
  const isAddUserDialogOpen = useAppSelector(selectIsAddUserDialogOpen);

  return (
    <DialogComponent isOpen={isAddUserDialogOpen}>
      <CreateAuthUserForm>{children}</CreateAuthUserForm>
    </DialogComponent>
  );
}
