'use client';

import {
  UsersDataGrid,
  QueryPageDataGrid,
  QueryFilterDataGrid,
  QuerySortDataGrid,
  UserDataToUpdateAdminSchema,
} from '@/types';
import { GridRowSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import UsersDataGridToolbar from './UsersDataGridToolbar';
import { useAppSelector } from '@/lib/redux/hooks';
import { Flip, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { getChangedDataGridValue } from '@/utils/dataGridHelpers';
import { getUserRoleBoolean } from '@/utils/auth';
import { updateUser } from '@/services/admin/update';
import { deleteUsers } from '@/services/admin/delete';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import getUsersDataGridColumns from './getUsersDataGridColumns';
import { useLogger } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES } from '@/constants';

type Props = {
  users: UsersDataGrid[] | null;
  totalRowCount: number;
  querySuccess: boolean;
  queryMessage: string;
  page: QueryPageDataGrid;
  sort: QuerySortDataGrid;
  filter: QueryFilterDataGrid;
};

export default function UsersPageAdminPanelClient({
  users,
  totalRowCount,
  querySuccess,
  queryMessage,
  page,
  sort,
  filter,
}: Props) {
  const log = useLogger();
  const router = useRouter();
  const userData = useAppSelector(selectUserData);
  const userRole = getUserRoleBoolean(userData?.role!);
  const [selectedUserIds, setSelectedUserIds] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const columns = getUsersDataGridColumns(userData?.userId ?? '', userRole!, isUpdating);
  const memoizedColumns = useMemo(() => columns, [columns]);

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel) {
    // Changing null to 'none' for role.
    // Users without a role, initially have role: null.
    // Data grid set to display null as 'none'.
    // Data grid select menu value cannot be null so using 'none'.
    // Value received from select menu is 'none'.
    // If role === null, update function will return no data received.
    const modifiedOldRow = oldRow.role === null ? { ...oldRow, role: 'none' } : oldRow;
    const modifiedNewRow = newRow.role === null ? { ...newRow, role: 'none' } : newRow;

    const validation = UserDataToUpdateAdminSchema.safeParse(modifiedNewRow);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, {
        userId: userData?.userId,
        payload: modifiedNewRow,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return oldRow;
    }

    const changedValue = getChangedDataGridValue(validation.data, modifiedOldRow);
    const objectKeyCount = getObjectKeyCount(changedValue);

    if (objectKeyCount === 0) {
      return oldRow;
    }

    if (
      (modifiedOldRow.role === 'owner' && !userRole.isOwner) ||
      (modifiedOldRow.role === 'manager' && !userRole.isOwner) ||
      (modifiedOldRow.role === 'admin' &&
        // Check userData?.userId === modifiedNewRow.userId to allow demo admin users to update their own data
        !(userRole.isOwner || userRole.isManager || userData?.userId === modifiedNewRow.userId))
    ) {
      toast.error(`Not authorized to update ${modifiedOldRow.role}`);

      return oldRow;
    }

    if (
      (changedValue.role === 'owner' && !userRole.isOwner) ||
      (changedValue.role === 'manager' && !userRole.isOwner) ||
      (changedValue.role === 'admin' && !(userRole.isOwner || userRole.isManager))
    ) {
      toast.error(`Not authorized to assign role '${changedValue.role}'`);

      return oldRow;
    }

    setIsUpdating(true);
    const toastId = toast.loading('Updating user...');

    const { success, message } = await updateUser({
      userId: oldRow.userId,
      currentRole: modifiedOldRow.role,
      dataToUpdate: changedValue,
    });

    if (success) {
      toast.update(toastId, {
        render: message,
        type: 'success',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });

      setIsUpdating(false);
      router.refresh();
      return newRow;
    } else {
      toast.update(toastId, {
        render: message,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });

      setIsUpdating(false);
      return oldRow;
    }
  }

  function handleRowUpdateError(error: unknown) {
    log.error('Failed to user order', { error });

    toast.error('Failed to process update. An unexpected error occured.');
  }

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedUserIds(rowSelectionModel);
  }

  async function handleDeleteUsers() {
    setIsDeleting(true);

    const { success, message } = await deleteUsers(selectedUserIds);

    if (success) {
      toast.success(message);
      setSelectedUserIds([]);
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsDeleting(false);
  }

  return (
    <CustomDataGrid
      data={users}
      getRowId={(row) => row.userId}
      totalRowCount={totalRowCount}
      querySuccess={querySuccess}
      queryMessage={queryMessage}
      page={page}
      sort={sort}
      filter={filter}
      columns={memoizedColumns}
      processRowUpdate={handleRowUpdate}
      onProcessRowUpdateError={handleRowUpdateError}
      onRowSelectionModelChange={handleRowSelection}
      checkboxSelection
      toolbar={
        <UsersDataGridToolbar
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          onDeleteClick={handleDeleteUsers}
          numberOfSelectedRows={selectedUserIds.length}
        />
      }
    />
  );
}
