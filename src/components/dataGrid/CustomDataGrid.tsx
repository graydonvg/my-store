'use client';

import { Box, useTheme } from '@mui/material';
import { DataGridQueryData } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { ReactNode, useEffect, useMemo } from 'react';
import CustomNoRowsOverlay from '../dataGrid/CustomNoRowsOverlay';
import { toast } from 'react-toastify';
import calculateTablePagination from '@/utils/calculateTablePagination';
import { validatePage } from '@/utils/validation';

type Props = {
  data: {}[] | null;
  columns: GridColDef[];
  querySuccess: boolean;
  queryMessage: string;
  totalRowCount: number;
  onRowUpdate: (newRow: GridValidRowModel, oldRow: GridValidRowModel) => GridValidRowModel | Promise<GridValidRowModel>;
  onRowSelection: (rowSelectionModel: GridRowSelectionModel) => void;
  hasCheckboxSelection: boolean;
  customToolbar: ReactNode;
} & DataGridQueryData<string, string>;

export default function CustomDataGrid({
  data,
  columns,
  querySuccess,
  queryMessage,
  page,
  range,
  sort,
  filter,
  totalRowCount,
  onRowUpdate,
  onRowSelection,
  hasCheckboxSelection,
  customToolbar,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const pageValidation = validatePage(page);
  const validatedPageNumber = pageValidation.data?.pageNumber!;
  const dataGridCurrentPageNumber = validatedPageNumber - 1;
  const validatedRowsPerPage = pageValidation.data?.rowsPerPage!;
  const searchParams = useSearchParams();
  const newSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const rowsPerPageOptionsSet = new Set([validatedRowsPerPage, 5, 10, 25, 50, 100]);
  const rowsPerPageOptionsArraySorted = Array.from(rowsPerPageOptionsSet).sort((a, b) => a - b);
  const { isEndOfData, lastPageNumber } = calculateTablePagination(data, range.start, page.rows, totalRowCount);

  useEffect(() => {
    // handle query builder validation error messages
    if (querySuccess === false) {
      toast.error(queryMessage);
    }
  }, [querySuccess, queryMessage]);

  useEffect(() => {
    // handle page number out of bounds
    if (validatedPageNumber > lastPageNumber) {
      toast.error('Page number out of bounds. Redirecting to first page.');

      newSearchParams.set('page', '1');

      router.push(`?${newSearchParams}`);
    }
  }, [validatedPageNumber, lastPageNumber, newSearchParams, router]);

  useEffect(() => {
    // handle page number and rows per page validation errors
    if (pageValidation.success === false) {
      toast.error(pageValidation.message);

      console.log(pageValidation.errorTarget);

      if (pageValidation.errorTarget === 'pageNumber') {
        newSearchParams.set('page', `${validatedPageNumber}`);
      } else {
        newSearchParams.set('per_page', `${validatedRowsPerPage}`);
      }

      router.push(`?${newSearchParams}`);
    }
  }, [
    pageValidation.success,
    pageValidation.message,
    validatedPageNumber,
    validatedRowsPerPage,
    pageValidation.errorTarget,
    newSearchParams,
    router,
  ]);

  function changePage(newPage: number) {
    newSearchParams.set('page', `${newPage + 1}`);

    router.push(`?${newSearchParams}`);
  }

  function changeRowsPerPage(newRowsPerPage: number) {
    const queryStart = dataGridCurrentPageNumber * newRowsPerPage;

    // Check if the newRowsPerPage will result in an empty page
    if (queryStart >= totalRowCount) {
      const maxValidPage = Math.ceil(totalRowCount / newRowsPerPage);

      newSearchParams.set('page', `${maxValidPage}`);
    }

    newSearchParams.set('per_page', `${newRowsPerPage}`);

    router.push(`?${newSearchParams}`);
  }

  function handlePaginationModelChange(model: GridPaginationModel) {
    changePage(model.page);

    if (model.pageSize !== validatedRowsPerPage) {
      changeRowsPerPage(model.pageSize);
    }
  }

  function handleGoToLastPage() {
    newSearchParams.set('page', `${lastPageNumber}`);

    router.push(`?${newSearchParams}`);
  }

  function handleSort(event: GridSortModel) {
    const sortData = event[0];

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

  function handleUpdateError(event: unknown) {
    console.log(event);
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        // subtract navbar height
        height: 'calc(100dvh - 64px)',
        width: 1,
      }}>
      <DataGrid
        rows={data ?? []}
        columns={columns}
        getRowId={(row) => row.userId}
        rowCount={totalRowCount}
        pageSizeOptions={rowsPerPageOptionsArraySorted}
        disableRowSelectionOnClick
        checkboxSelection={hasCheckboxSelection}
        onRowSelectionModelChange={onRowSelection}
        pagination
        paginationMode="server"
        paginationModel={{ page: dataGridCurrentPageNumber, pageSize: validatedRowsPerPage }}
        onPaginationModelChange={handlePaginationModelChange}
        processRowUpdate={onRowUpdate}
        onProcessRowUpdateError={handleUpdateError}
        filterMode="server"
        onFilterModelChange={handleFilter}
        sortingMode="server"
        sortingOrder={['desc', 'asc']}
        sortModel={[{ field: sort.by, sort: sort.direction }]}
        onSortModelChange={handleSort}
        showCellVerticalBorder
        disableColumnMenu
        slots={{
          toolbar: () => customToolbar,
          noResultsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
          noRowsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
        }}
        slotProps={{
          pagination: {
            showFirstButton: true,
            showLastButton: true,
            labelRowsPerPage: 'Rows:',
            slotProps: {
              actions: {
                nextButton: {
                  disabled: isEndOfData,
                },
                lastButton: {
                  disabled: isEndOfData,
                  onClick: handleGoToLastPage,
                },
              },
            },
            sx: {
              width: { xs: 1, sm: 'auto' },
              '& .MuiTablePagination-selectLabel': { display: 'block' },
              '& .MuiTablePagination-input': { display: 'inline-flex', marginRight: '20px' },
            },
          },
        }}
        sx={{
          '--unstable_DataGrid-radius': 0,
          border: 'none',

          '& .MuiDataGrid-toolbarContainer': {
            paddingRight: 2,
            paddingLeft: '11px',
            paddingY: 1,
            backgroundColor: theme.palette.custom.dataGrid.toolbar,
            borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
            borderBottom: `1px solid ${theme.palette.custom.dataGrid.border}`,
          },

          '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.custom.dataGrid.header,
            outlineOffset: -2,
            outline: 0,

            '&:focus-within': {
              outlineOffset: -2,
            },
          },

          '& .MuiDataGrid-columnSeparator--resizable': {
            opacity: '0 !important',
          },

          '& .MuiDataGrid-filler': {
            backgroundColor: theme.palette.custom.dataGrid.header,
          },

          '& .mui-tgsonj': {
            backgroundColor: theme.palette.background.paper,
          },

          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.custom.dataGrid.footer,
            '& .MuiDataGrid-selectedRowCount': {
              display: { xs: 'none', sm: 'flex' },
            },
          },
        }}
      />
    </Box>
  );
}
