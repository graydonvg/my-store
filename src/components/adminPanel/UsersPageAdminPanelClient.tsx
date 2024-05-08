'use client';

import { Box } from '@mui/material';
import {
  AdminUsersTableUserData,
  DataGridQueryData,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
  UserRole,
} from '@/types';
import {
  GridColDef,
  GridRowSelectionModel,
  GridValidRowModel,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import MuiLink from '../ui/MuiLink';
import DatePickerForDataGridFilter from '../dataGrid/DatePickerForDataGridFilter';
import { USER_ROLE_OPTIONS } from '@/data';
import CustomDataGrid from '../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import UsersDataGridToolbarAdminPanel from '../dataGrid/UsersDataGridToolbarAdminPanel';
import { useAppSelector } from '@/lib/redux/hooks';
import { deleteAuthUser } from '@/services/users/delete';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { toastPromiseErrorOptions, toastPromiseSuccessOptions } from '../ui/Toast';

function getColumns(userRole: UserRole) {
  const columns: GridColDef<AdminUsersTableUserData>[] = [
    {
      field: 'userId',
      headerName: 'ID',
      width: 300,
      sortable: false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value === 'equals'),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 1 }}>
          <MuiLink>{params.row.userId}</MuiLink>
        </Box>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 180,
      renderCell: (params) => params.row.createdAt,
      filterOperators: getGridNumericOperators()
        .filter(
          (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
        )
        .map((operator) => ({
          ...operator,
          InputComponent: operator.InputComponent ? DatePickerForDataGridFilter : undefined,
        })),
    },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact number',
      width: 165,
      editable: true,
      sortable: true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: userRole === 'admin' ? false : true,
      sortable: true,
      type: 'singleSelect',
      valueOptions: USER_ROLE_OPTIONS.filter((role) => {
        if (userRole === 'admin') {
          return role === 'null';
        } else if (userRole === 'manager') {
          return role === 'null' || role === 'admin';
        } else {
          return role;
        }
      }),
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
      renderCell: (params) => (params.row.role === null ? 'null' : params.row.role),
    },
  ];
  return columns;
}

type Props = {
  users: AdminUsersTableUserData[] | null;
  querySuccess: boolean;
  queryMessage: string;
  totalRowCount: number;
} & DataGridQueryData<AdminUsersDataGridFilterableColumns, AdminUsersDataGridSortableColumns>;

export default function UsersPageAdminPanelClient(props: Props) {
  const router = useRouter();
  const { users, querySuccess, queryMessage, page, range, sort, filter, totalRowCount } = props;
  const userData = useAppSelector((state) => state.user.data);
  const columns = getColumns(userData?.role!);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const [selectedUserIds, setSelectedUserIds] = useState<GridRowSelectionModel>([]);

  function compareObjectValues(newObj: GridValidRowModel, oldObj: GridValidRowModel) {
    const changedValues: GridValidRowModel = {};

    // Iterate over all properties in obj1
    for (let key in newObj) {
      // Check if the property exists in obj2 and has a different value
      if (newObj[key] !== oldObj[key]) {
        changedValues[key] = newObj[key];
      }
    }

    return changedValues;
  }

  function handleRowUpdate(
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel
  ): GridValidRowModel | Promise<GridValidRowModel> {
    const changedValues = compareObjectValues(newRow, oldRow) as Partial<AdminUsersTableUserData>;

    if (userData?.role !== 'owner' && oldRow.role === 'owner') {
      toast.error('Failed to update role. Not authorized.');
      return oldRow;
    }

    console.log(changedValues);

    return newRow;
  }

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedUserIds(rowSelectionModel);
  }

  async function handleDeleteUsers() {
    if (selectedUserIds.includes(userData?.userId!)) {
      toast.error('Cannot delete your own account.');
      return;
    }

    // const usersToDelete =
    //   users
    //     ?.filter((user) => selectedUserIds.includes(user.userId))
    //     .map((user) => {
    //       return { userId: user.userId, role: user.role };
    //     }) ?? [];

    // const includesAdminToDelete = usersToDelete.some((user) => user.role === 'admin');
    // const includesOwnerToDelete = usersToDelete.some((user) => user.role === 'owner');

    // if (includesAdminToDelete && includesOwnerToDelete) {
    //   toast.error('Not authorized to delete users with admin or owner role.');
    //   return;
    // } else if (includesAdminToDelete) {
    //   toast.error('Not authorized to delete users with admin role.');
    //   return;
    // } else if (includesOwnerToDelete) {
    //   toast.error('Not authorized to delete users with owner role.');
    //   return;
    // }

    const toastId = toast.loading(`Deleting user${selectedUserIds.length > 1 ? 's' : ''}.`);

    const { success, message } = await deleteAuthUser(selectedUserIds);

    if (success) {
      toast.update(toastId, {
        render: message,
        ...toastPromiseSuccessOptions,
      });
      setSelectedUserIds([]);
      router.refresh();
    } else {
      toast.update(toastId, {
        render: message,
        ...toastPromiseErrorOptions,
      });
    }
  }

  return (
    <CustomDataGrid
      data={users}
      columns={memoizedColumns}
      querySuccess={querySuccess}
      queryMessage={queryMessage}
      page={page}
      range={range}
      sort={sort}
      filter={filter}
      totalRowCount={totalRowCount}
      onRowUpdate={handleRowUpdate}
      onRowSelection={handleRowSelection}
      hasCheckboxSelection={userData?.role === 'admin' ? false : true}
      customToolbar={
        <UsersDataGridToolbarAdminPanel
          onDeleteClick={handleDeleteUsers}
          numberOfSelectedRows={selectedUserIds.length}
        />
      }
    />
  );
}
