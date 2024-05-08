'use client';

import { Box, tablePaginationClasses, useMediaQuery, useTheme } from '@mui/material';
import { DataGridQueryData } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DataGrid,
  DataGridProps,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  gridClasses,
} from '@mui/x-data-grid';
import { ReactNode, useEffect, useMemo } from 'react';
import CustomNoRowsOverlay from '../dataGrid/CustomNoRowsOverlay';
import { toast } from 'react-toastify';
import calculateTablePagination from '@/utils/calculateTablePagination';
import { validatePage } from '@/utils/validation';

type Props = {
  data: {}[] | null;
  querySuccess: boolean;
  queryMessage: string;
  totalRowCount: number;
  customToolbar: ReactNode;
} & DataGridQueryData<string, string> &
  DataGridProps;

export default function CustomDataGrid({
  data,
  querySuccess,
  queryMessage,
  page,
  range,
  sort,
  filter,
  totalRowCount,
  customToolbar,
  ...datagridProps
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
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
        borderRadius: 0,
        // subtract navbar height
        height: 'calc(100dvh - 64px)',
        width: 1,
      }}>
      <DataGrid
        rows={data ?? []}
        getRowId={(row) => row.userId}
        rowCount={totalRowCount}
        pageSizeOptions={rowsPerPageOptionsArraySorted}
        disableRowSelectionOnClick
        pagination
        paginationMode="server"
        paginationModel={{ page: dataGridCurrentPageNumber, pageSize: validatedRowsPerPage }}
        onPaginationModelChange={handlePaginationModelChange}
        onProcessRowUpdateError={handleUpdateError}
        filterMode="server"
        onFilterModelChange={handleFilter}
        sortingMode="server"
        sortingOrder={['desc', 'asc']}
        sortModel={[{ field: sort.by, sort: sort.direction }]}
        onSortModelChange={handleSort}
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnMenu
        initialState={{ density: isBelowSmall ? 'compact' : 'standard' }}
        slots={{
          toolbar: () => customToolbar,
          noResultsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
          noRowsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
        }}
        slotProps={{
          columnsManagement: { autoFocusSearchField: false },
          filterPanel: {
            filterFormProps: {
              deleteIconProps: {
                sx: {
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  alignItems: 'flex-end',
                  width: 'auto',
                },
              },
              columnInputProps: {
                sx: { width: { xs: 1, sm: '150px' } },
              },
              operatorInputProps: { sx: { width: { xs: 1, sm: '120px' } } },
              valueInputProps: {
                sx: {
                  width: { xs: 1, sm: '190px' },
                },
              },
            },
            sx: {
              [`& .${gridClasses.filterForm}`]: {
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', rowGap: '8px' },
              },
            },
          },
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
              [`& .${tablePaginationClasses.selectLabel}`]: { display: 'block' },
              [`& .${tablePaginationClasses.input}`]: { display: 'inline-flex', marginRight: { xs: '20px', sm: 4 } },
              [`& .${tablePaginationClasses.actions}`]: { marginLeft: { xs: 2, sm: '20px' } },
            },
          },
        }}
        sx={{
          '--unstable_DataGrid-radius': 0,
          border: 'none',

          [`& .${gridClasses.toolbarContainer}`]: {
            paddingRight: 2,
            paddingLeft: '11px',
            paddingY: 1,
            backgroundColor: theme.palette.custom.dataGrid.toolbar,
            borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
            borderBottom: `1px solid ${theme.palette.custom.dataGrid.border}`,
          },

          [`& .${gridClasses.columnHeader}`]: {
            backgroundColor: theme.palette.custom.dataGrid.header,
            outlineOffset: -2,
            outline: 0,

            '&:focus-within': {
              outlineOffset: -2,
            },
          },

          [`& .${gridClasses['columnSeparator--resizable']}`]: {
            opacity: '0 !important',
          },

          [`& .${gridClasses.filler}`]: {
            backgroundColor: theme.palette.custom.dataGrid.header,
          },

          '& .mui-tgsonj': {
            backgroundColor: theme.palette.background.default,
          },

          [`& .${gridClasses.footerContainer}`]: {
            backgroundColor: theme.palette.custom.dataGrid.toolbar,

            [`& .${gridClasses.selectedRowCount}`]: {
              display: { xs: 'none', sm: 'flex' },
            },
          },
        }}
        {...datagridProps}
      />
    </Box>
  );
}
