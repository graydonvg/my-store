import DatePickerForDataGridFilter from '@/components/dataGrid/DatePickerForDataGridFilter';
import EditableCell from '@/components/dataGrid/EditableCell';
import { USER_ROLE_OPTIONS } from '@/constants';

import { UsersDataGrid } from '@/types';
import {
  GridColDef,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

export default function getUsersDataGridColumns(
  userId: string,
  userRole: { isAdmin: boolean; isManager: boolean; isOwner: boolean },
  isUpdating: boolean
) {
  const columns: GridColDef<UsersDataGrid>[] = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: !isUpdating ? true : false,
      renderCell: (params) =>
        params.row.createdBy === userId || !userRole.isAdmin ? (
          <EditableCell>{params.value}</EditableCell>
        ) : (
          params.value
        ),
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: !isUpdating ? true : false,
      renderCell: (params) =>
        params.row.createdBy === userId || !userRole.isAdmin ? (
          <EditableCell>{params.value}</EditableCell>
        ) : (
          params.value
        ),
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      editable: userRole.isAdmin ? false : !isUpdating ? true : false,
      type: 'singleSelect',
      valueOptions: (params) => {
        const filteredOptions = USER_ROLE_OPTIONS.filter((role) => {
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
      // If role === null, updateUser endpoint will return no data received.
      valueGetter: (role) => (role === null ? 'none' : role),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact number',
      width: 165,
      editable: !isUpdating ? true : false,
      renderCell: (params) =>
        params.row.createdBy === userId || !userRole.isAdmin ? (
          <EditableCell>{params.value}</EditableCell>
        ) : (
          params.value
        ),
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
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
      field: 'userId',
      headerName: 'ID',
      width: 300,
      sortable: false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value === 'equals'),
    },
  ];

  return columns;
}
