'use client';

import { Box } from '@mui/material';
import {
  AdminUsersTableUserData,
  DataGridQueryData,
  UserRole,
  AdminUsersDataGridFilterableColumns,
  AdminUsersDataGridSortableColumns,
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
import { USER_ROLE_OPTIONS } from '@/config';
import CustomDataGrid from '../dataGrid/CustomDataGrid';
import { useMemo } from 'react';
import CustomDataGridToolbar from '../dataGrid/CustomDataGridToolbar';
import CreateAuthUserDialog from '../dialogs/CreateAuthUserDialog';
import { useAppSelector } from '@/lib/redux/hooks';

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
      editable: false,
      sortable: true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: true,
      sortable: true,
      type: 'singleSelect',
      valueOptions: USER_ROLE_OPTIONS.filter((role) => {
        if (userRole === 'manager') {
          return role;
        } else {
          return role !== 'manager';
        }
      }),
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
      renderCell: (params) => params.row.role,
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

export default function AdminUsersPageClient(props: Props) {
  const { users, querySuccess, queryMessage, page, range, sort, filter, totalRowCount } = props;
  const userRole = useAppSelector((state) => state.user.data?.role);
  const columns = getColumns(userRole!);
  const memoizedColumns = useMemo(() => columns, [columns]);

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

    console.log(changedValues);

    return newRow;
  }

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    console.log('rowSelectionModel', rowSelectionModel);
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
      hasCheckboxSelection={true}
      customToolbar={
        <CustomDataGridToolbar>
          <CreateAuthUserDialog />
        </CustomDataGridToolbar>
      }
    />
  );
}
