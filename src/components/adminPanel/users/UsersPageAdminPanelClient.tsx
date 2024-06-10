'use client';

import {
  UsersDataGridDataAdmin,
  UpdateUserAdminDb,
  QueryPageDataGrid,
  QueryFilterDataGrid,
  QuerySortDataGrid,
} from '@/types';
import {
  GridColDef,
  GridRowSelectionModel,
  GridValidRowModel,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import DatePickerForDataGridFilter from '../../dataGrid/DatePickerForDataGridFilter';
import { CONSTANTS } from '@/constants';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import UsersDataGridToolbar from './UsersDataGridToolbar';
import { useAppSelector } from '@/lib/redux/hooks';
import { Flip, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getObjectKeyCount } from '@/utils/checkForms';
import dayjs from 'dayjs';
import { getChangedDataGridValue } from '@/utils/getChangedDataGridValues';
import { getUserRoleBoolean } from '@/utils/getUserRole';
import { updateUser } from '@/services/admin/update';
import { deleteUser } from '@/services/admin/delete';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { usersDataGridNewRowSchema } from '@/schemas/usersDataGridNewRowSchema';
import { trimWhitespaceFromObjectValues } from '@/utils/transform';

function getColumns(userRole: { isAdmin: boolean; isManager: boolean; isOwner: boolean }, isUpdating: boolean) {
  const columns: GridColDef<UsersDataGridDataAdmin>[] = [
    {
      field: 'userId',
      headerName: 'ID',
      width: 300,
      sortable: false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value === 'equals'),
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 160,
      renderCell: (params) => dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      filterOperators: getGridDateOperators()
        .filter((operator) => operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty')
        .map((operator) => ({
          ...operator,
          InputComponent: operator.InputComponent ? DatePickerForDataGridFilter : undefined,
        })),
    },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: !isUpdating ? true : false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: !isUpdating ? true : false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: !isUpdating ? true : false,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact number',
      width: 165,
      editable: !isUpdating ? true : false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: userRole.isAdmin ? false : !isUpdating ? true : false,
      type: 'singleSelect',
      valueOptions: (params) => {
        const filteredOptions = CONSTANTS.USER_ROLE_OPTIONS.filter((role) => {
          if (userRole.isAdmin) {
            return role === 'none';
          } else if (userRole.isManager) {
            return role === 'none' || role === 'admin';
          } else {
            return role;
          }
        });

        // Keep the users current role in the list of options to prevent 'out-of-range' value after filtering for select component
        if (params.row?.role && !filteredOptions.includes(params.row?.role)) {
          filteredOptions.push(params.row?.role);
        }

        return filteredOptions;
      },
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
      // Changing null to 'none' for role.
      // Users without a role, initially have role: null.
      // Data grid set to display null as 'none'.
      // Data grid select menu value cannot be null so using 'none'.
      // Value received from select menu is 'none'.
      // If role === null, adminUpdateUser will return no data received.
      valueGetter: (role) => (role === null ? 'none' : role),
    },
  ];
  return columns;
}

type Props = {
  users: UsersDataGridDataAdmin[] | null;
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
  const router = useRouter();
  const userData = useAppSelector(selectUserData);
  const userRole = getUserRoleBoolean(userData?.role!);
  const [selectedUserIds, setSelectedUserIds] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const columns = getColumns(userRole!, isUpdating);
  const memoizedColumns = useMemo(() => columns, [columns]);

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel) {
    const validation = usersDataGridNewRowSchema.safeParse(newRow);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => toast.error(issue.message));

      return oldRow;
    }

    // Changing null to 'none' for role.
    // Users without a role, initially have role: null.
    // Data grid set to display null as 'none'.
    // Data grid select menu value cannot be null so using 'none'.
    // Value received from select menu is 'none'.
    // If role === null, update function will return no data received.
    const modifiedOldRow = oldRow.role === null ? { ...oldRow, role: 'none' } : oldRow;
    const modifiedNewRow = newRow.role === null ? { ...newRow, role: 'none' } : newRow;

    const changedValue = getChangedDataGridValue(modifiedNewRow, modifiedOldRow);
    const trimmedChangedValue = trimWhitespaceFromObjectValues(changedValue);
    const numberOfFieldsToUpdate = getObjectKeyCount(trimmedChangedValue);

    if (numberOfFieldsToUpdate === 0) {
      return oldRow;
    }

    if (
      (modifiedOldRow.role === 'owner' && !userRole.isOwner) ||
      (modifiedOldRow.role === 'manager' && !userRole.isOwner) ||
      (modifiedOldRow.role === 'admin' && !(userRole.isOwner || userRole.isManager))
    ) {
      toast.error(`Not authorized to update ${modifiedOldRow.role}`);

      return oldRow;
    }

    if (
      (modifiedNewRow.role === 'owner' && !userRole.isOwner) ||
      (modifiedNewRow.role === 'manager' && !userRole.isOwner) ||
      (modifiedNewRow.role === 'admin' && !(userRole.isOwner || userRole.isManager))
    ) {
      toast.error(`Not authorized to assign role - ${modifiedNewRow.role}`);

      return oldRow;
    }

    const modifiedChangedValue: UpdateUserAdminDb = {
      userId: oldRow.userId,
      currentRole: modifiedOldRow.role,
      dataToUpdate: trimmedChangedValue,
    };

    setIsUpdating(true);
    const toastId = toast.loading('Updating user...');

    const { success, message } = await updateUser({ ...modifiedChangedValue });

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

  function handleRowUpdateError(_error: unknown) {
    // Axiom error log
    toast.error('Failed to process update. An unexpected data grid error occured.');
  }

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedUserIds(rowSelectionModel);
  }

  async function handleDeleteUsers() {
    setIsDeleting(true);

    const { success, message } = await deleteUser(selectedUserIds);

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
      checkboxSelection={userData?.role === 'admin' ? false : true}
      toolbar={
        <UsersDataGridToolbar
          isDeleting={isDeleting}
          onDeleteClick={handleDeleteUsers}
          numberOfSelectedRows={selectedUserIds.length}
        />
      }
    />
  );
}
