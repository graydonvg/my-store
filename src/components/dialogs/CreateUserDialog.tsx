'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import CreateUserForm from '../forms/CreateUserForm';
import DialogComponent from '../ui/DialogComponent';
import { selectIsAddUserDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CreateUserDialog({ children }: Props) {
  const isAddUserDialogOpen = useAppSelector(selectIsAddUserDialogOpen);

  return (
    <DialogComponent isOpen={isAddUserDialogOpen}>
      <CreateUserForm>{children}</CreateUserForm>
    </DialogComponent>
  );
}
