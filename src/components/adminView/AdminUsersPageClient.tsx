'use client';

import { Box, TablePagination, useTheme } from '@mui/material';
import { AdminUserDataType, TableFilter, UsersFilterableColumns } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortDirection,
  GridSortModel,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import { ChangeEvent, MouseEvent, useEffect, useMemo } from 'react';
import CustomNoRowsOverlay from '../dataGrid/CustomNoRowsOverlay';
import CustomDataGridToolbar from '../dataGrid/CustomDataGridToolbar';
import MuiLink from '../ui/MuiLink';
import DatePickerForDataGridFilter from '../dataGrid/DatePickerForDataGridFilter';
import { toast } from 'react-toastify';

const columns: GridColDef<AdminUserDataType>[] = [
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
    valueOptions: ['manager', 'admin', 'customer'],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
    renderCell: (params) => params.row.role,
  },
];

type Props = {
  users: AdminUserDataType[] | null;
  querySuccess: boolean;
  queryMessage: string;
  page: {
    number: number;
    rows: number;
  };
  sort: {
    by: string;
    direction: GridSortDirection;
  };
  filter: TableFilter<UsersFilterableColumns>;
  isEndOfData: boolean;
  lastPageNumber: number;
  totalRowCount: number;
};

export default function AdminUsersPageClient({
  users,
  querySuccess,
  queryMessage,
  page,
  sort,
  filter,
  isEndOfData,
  lastPageNumber,
  totalRowCount,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const currentPage = Number.isNaN(page.number) ? 0 : page.number - 1;
  const rowsPerPage = Number.isNaN(page.rows) ? 5 : page.rows;
  const memoizedColumns = useMemo(() => columns, []);
  const rowsPerPageOptionsSet = new Set([rowsPerPage, 5, 10, 25, 50, 100]);
  const rowsPerPageOptionsArraySorted = Array.from(rowsPerPageOptionsSet).sort((a, b) => a - b);

  useEffect(() => {
    if (querySuccess === false) {
      toast.error(queryMessage);
    }
  }, [querySuccess, queryMessage]);

  useEffect(() => {
    // handle large numbers
    if (currentPage > lastPageNumber) {
      toast.error('Page number out of bounds. Returning to first page.');

      newSearchParams.set('page', '1');

      router.push(`?${newSearchParams}`);
    }
  }, [currentPage, lastPageNumber, newSearchParams, router]);

  useEffect(() => {
    // handle negative numbers
    if (currentPage <= 0) {
      newSearchParams.set('page', '1');

      router.push(`?${newSearchParams}`);
    }

    if (rowsPerPage <= 0) {
      newSearchParams.set('per_page', '5');

      router.push(`?${newSearchParams}`);
    }
  }, [currentPage, rowsPerPage, newSearchParams, router]);

  function handleChangePage(_event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null, newPage: number) {
    newSearchParams.set('page', `${newPage + 1}`);

    router.push(`?${newSearchParams}`);
  }

  function handleRowsPerPageChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const queryStart = currentPage * newRowsPerPage;

    // Check if the newRowsPerPage will result in an empty page
    if (queryStart >= totalRowCount) {
      const maxValidPage = Math.ceil(totalRowCount / newRowsPerPage);

      newSearchParams.set('page', `${maxValidPage}`);
    }

    newSearchParams.set('per_page', `${newRowsPerPage}`);

    router.push(`?${newSearchParams}`);
  }

  function handleGoToLastPage() {
    newSearchParams.set('page', `${lastPageNumber}`);

    router.push(`?${newSearchParams}`);
  }

  function handleSort(event: GridSortModel) {
    const sortData = event[0];

    console.log(sortData);

    if (sortData) {
      const sortField = sortData.field;
      const sortDirection = sortData.sort;

      newSearchParams.set('sort_by', `${sortField}`);
      newSearchParams.set('sort', `${sortDirection}`);
    } else {
      newSearchParams.delete('sort_by');
      newSearchParams.delete('sort');
    }

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  function handleFilter(event: GridFilterModel) {
    const filterData = event.items.length > 0 ? event.items[0] : null;

    const previousFilterValue = filter.value;

    // isEmpty and isNotEmpty have no values
    if (
      previousFilterValue ||
      (!previousFilterValue && filterData?.operator == 'isEmpty') ||
      filterData?.operator === 'isNotEmpty'
    ) {
      // Cannot access delete button event independently.
      // Delete button on filter clears filter value.
      // This removes the filter query string if the value changes or is removed.
      // Create a custom filter panel in future to access click events.
      newSearchParams.delete('col');
      newSearchParams.delete('op');
      newSearchParams.delete('val');

      router.push(`?${newSearchParams}`, { scroll: false });
    }

    if (!filterData) return;

    // isEmpty and isNotEmpty have no values
    if (!filterData.value && filterData?.operator !== 'isEmpty' && filterData?.operator !== 'isNotEmpty') return;

    newSearchParams.set('col', `${filterData.field}`);
    newSearchParams.set('op', `${filterData.operator}`);
    newSearchParams.set('val', `${filterData.value}`);

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  function update(event: AdminUserDataType) {
    console.log(event);
    return event;
  }

  function updateError(event: unknown) {
    console.log(event);
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        // subtract navbar and footer height
        height: 'calc(100dvh - 120px)',
        width: 1,
      }}>
      <DataGrid
        rows={users ?? []}
        columns={memoizedColumns}
        getRowId={(row) => row.userId}
        rowCount={totalRowCount}
        disableRowSelectionOnClick
        paginationMode="server"
        processRowUpdate={update}
        onProcessRowUpdateError={updateError}
        filterMode="server"
        onFilterModelChange={handleFilter}
        sortingMode="server"
        sortingOrder={['desc', 'asc']}
        sortModel={[{ field: sort.by, sort: sort.direction }]}
        onSortModelChange={handleSort}
        showCellVerticalBorder
        disableColumnMenu
        hideFooter
        slots={{
          toolbar: CustomDataGridToolbar,
          noResultsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
          noRowsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
        }}
        sx={{
          '--unstable_DataGrid-radius': 0,
          border: 'none',

          '& .MuiDataGrid-toolbarContainer': {
            paddingRight: 2,
            paddingLeft: '11px',
            paddingY: 1,
            backgroundColor: theme.palette.custom.table.toolbar,
            borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
            borderBottom: `1px solid ${theme.palette.custom.table.border}`,
          },

          '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.custom.table.header,
            padding: 2,
            outlineOffset: -2,
            outline: 0,

            '&:focus-within': {
              outlineOffset: -2,
            },
          },

          '& .MuiDataGrid-columnSeparator--resizable': {
            opacity: '0 !important',
          },

          '& .MuiDataGrid-cell': {
            paddingX: 2,
          },

          '& .MuiDataGrid-filler': {
            backgroundColor: theme.palette.custom.table.header,
          },

          '& .mui-tgsonj': {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      />
      <TablePagination
        component="div"
        count={totalRowCount}
        rowsPerPageOptions={rowsPerPageOptionsArraySorted}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Rows:"
        showFirstButton
        showLastButton
        slotProps={{
          actions: {
            nextButton: {
              disabled: isEndOfData,
            },
            lastButton: {
              disabled: isEndOfData,
              onClick: handleGoToLastPage,
            },
          },
        }}
        sx={{
          backgroundColor: theme.palette.custom.table.footer,
          '& .MuiTablePagination-toolbar': {
            paddingX: 2,
            paddingY: 1,
            minHeight: 0,
          },
          '& .MuiTablePagination-input': {
            marginRight: { xs: 2, sm: 4 },
          },
        }}
      />
    </Box>
  );
}