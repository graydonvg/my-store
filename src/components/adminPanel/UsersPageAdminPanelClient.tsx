'use client';

import {
  AdminUsersTableUserData,
  DataGridQueryData,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
  UserRole,
  AdminUpdateUserDb,
} from '@/types';
import {
  GridColDef,
  GridRowSelectionModel,
  GridValidRowModel,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import DatePickerForDataGridFilter from '../dataGrid/DatePickerForDataGridFilter';
import { USER_ROLE_OPTIONS } from '@/data';
import CustomDataGrid from '../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import UsersDataGridToolbarAdminPanel from '../dataGrid/UsersDataGridToolbarAdminPanel';
import { useAppSelector } from '@/lib/redux/hooks';
import { deleteAuthUser } from '@/services/users/delete';
import { Flip, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { adminUpdateUser } from '@/services/users/update';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import dayjs from 'dayjs';

function getColumns(userRole: UserRole, isUpdating: boolean) {
  const columns: GridColDef<AdminUsersTableUserData>[] = [
    {
      field: 'userId',
      headerName: 'ID',
      width: 300,
      sortable: false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value === 'equals'),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 160,
      renderCell: (params) => dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
      sortable: true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      pinnable: true,
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: userRole === 'admin' ? false : !isUpdating ? true : false,
      sortable: true,
      type: 'singleSelect',
      valueOptions: USER_ROLE_OPTIONS.filter((role) => {
        if (userRole === 'admin') {
          return role === 'none';
        } else if (userRole === 'manager') {
          return role === 'none' || role === 'admin';
        } else {
          return role;
        }
      }),
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
      // Changing null to 'none' for role.
      // Users without a role, initially have role: null.
      // Datagrid set to display null as 'none'.
      // Datagrid select menu value cannot be null so using 'none'.
      // Value received from select menu is 'none'.
      // If role === null, adminUpdateUser will return no data received.
      valueGetter: (role) => (role === null ? 'none' : role),
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

export default function UsersPageAdminPanelClient({
  users,
  querySuccess,
  queryMessage,
  page,
  range,
  sort,
  filter,
  totalRowCount,
}: Props) {
  const router = useRouter();
  const userData = useAppSelector((state) => state.user.data);
  const [selectedUserIds, setSelectedUserIds] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const columns = getColumns(userData?.role!, isUpdating);
  const memoizedColumns = useMemo(() => columns, [columns]);

  function compareObjectValues(newObj: GridValidRowModel, oldObj: GridValidRowModel) {
    const changedValues: GridValidRowModel = {};

    // Iterate over all properties in obj1
    for (let key in newObj) {
      // Check if the property exists in obj2 and has a different value
      if (newObj[key] !== oldObj[key]) {
        if (newObj[key] === '') {
          // Names and contact number not required.
          // Set empty strings to null to prevent empty string in db
          changedValues[key] = null;
        } else {
          changedValues[key] = newObj[key];
        }
      }
    }

    return changedValues;
  }

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel): Promise<GridValidRowModel> {
    // Changing null to 'none' for role.
    // Users without a role, initially have role: null.
    // Datagrid set to display null as 'none'.
    // Datagrid select menu value cannot be null so using 'none'.
    // Value received from select menu is 'none'.
    // If role === null, adminUpdateUser will return no data received.
    const modifiedOldRow = oldRow.role === null ? { ...oldRow, role: 'none' } : oldRow;
    const modifiedNewRow = newRow.role === null ? { ...newRow, role: 'none' } : newRow;
    const changedValues = compareObjectValues(modifiedNewRow, modifiedOldRow) as AdminUpdateUserDb;
    const numberOfFormFields = getNumberOfFormFields(changedValues);

    if (numberOfFormFields === 0) {
      return oldRow;
    }

    const modifiedChangedValues = changedValues.role
      ? { ...changedValues, role: { old: modifiedOldRow.role, new: modifiedNewRow.role } }
      : changedValues;

    setIsUpdating(true);
    const toastId = toast.loading('Updating user.');

    const { success, message } = await adminUpdateUser({ userId: newRow.userId, ...modifiedChangedValues });

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

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedUserIds(rowSelectionModel);
  }

  async function handleDeleteUsers() {
    setIsDeleting(true);

    const { success, message } = await deleteAuthUser(selectedUserIds);

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
      columns={memoizedColumns}
      querySuccess={querySuccess}
      queryMessage={queryMessage}
      page={page}
      range={range}
      sort={sort}
      filter={filter}
      totalRowCount={totalRowCount}
      processRowUpdate={handleRowUpdate}
      onRowSelectionModelChange={handleRowSelection}
      checkboxSelection={userData?.role === 'admin' ? false : true}
      customToolbar={
        <UsersDataGridToolbarAdminPanel
          isDeleting={isDeleting}
          onDeleteClick={handleDeleteUsers}
          numberOfSelectedRows={selectedUserIds.length}
        />
      }
    />
  );
}
