'use client';

import {
  AdminUsersTableUserData,
  DataGridQueryData,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
  UserRole,
  UpdateUserDb,
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
import { toast } from 'react-toastify';
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
      renderCell: (params) => (params.row.role === null ? 'none' : params.row.role),
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
        changedValues[key] = newObj[key] === '' ? null : newObj[key];
      }
    }

    return changedValues;
  }

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel): Promise<GridValidRowModel> {
    setIsUpdating(true);
    const changedValues = compareObjectValues(newRow, oldRow) as UpdateUserDb;
    const numberOfFormFields = getNumberOfFormFields(changedValues);

    if (numberOfFormFields === 0) {
      setIsUpdating(false);
      router.refresh();
      return oldRow;
    }

    const { success, message } = await adminUpdateUser({ userId: newRow.userId, ...changedValues });

    if (success) {
      toast.success(message);
      setIsUpdating(false);
      router.refresh();
      return newRow;
    } else {
      toast.error(message);
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
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
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
